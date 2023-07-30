/**!
 * jquery.fancytree.contextmenu.js
 *
 * Integrate the 'jQuery contextMenu' plugin as Fancytree extension:
 * https://github.com/swisnl/jQuery-contextMenu
 *
 * Copyright (c) 2008-2018, Martin Wendt (https://wwWendt.de)
 * Released under the MIT license
 * https://github.com/mar10/fancytree/wiki/LicenseInfo
 */
(function($, document)
{
    'use strict';

    var initContextMenu = function(tree, selector, menu, actions)
    {
        tree.$container.on('mousedown.contextMenu', function(event)
        {
            var node = $.ui.fancytree.getNode(event);

            if(node)
            {
                $.contextMenu('destroy', '.' + selector);

                // node.setFocus(true);
                // node.setActive(true);

                $.contextMenu({
                    selector: '.' + selector,
                    zIndex  : 10,
                    events  : {
                        preShow: function(options)
                        {
                            if($(options).closest('#tree').length == 0 && $(options).closest('#note_tree').length == 0)
                            {
                                return false;
                            }
                        },
                        show   : function(options)
                        {
                            options.prevKeyboard = tree.options.keyboard;
                            tree.options.keyboard = false;
                        },
                        hide   : function(options)
                        {
                            tree.options.keyboard = options.prevKeyboard;
                            node.setFocus(true);
                        }
                    },
                    build   : function($trigger, e)
                    {
                        node = $.ui.fancytree.getNode($trigger);

                        render_node_menu(node, menu);
                        var menuItems = {};
                        if($.isFunction(menu))
                        {
                            menuItems = menu(node);
                        }
                        else if($.isPlainObject(menu))
                        {
                            menuItems = menu;
                        }

                        return {
                            callback: function(action, options)
                            {
                                if($.isFunction(actions))
                                {
                                    actions(node, action, options);
                                }
                                else if($.isPlainObject(actions))
                                {
                                    if(
                                        actions.hasOwnProperty(action) &&
                                        $.isFunction(actions[action])
                                    )
                                    {
                                        actions[action](node, options);
                                    }
                                }
                            },
                            items   : menuItems
                        };
                    }
                });
            }
        });
    };

    $.ui.fancytree.registerExtension({
        name       : 'contextMenu',
        version    : '@VERSION',
        contextMenu: {
            // selector: "fancytree-title",
            selector: 'fancytree-node',
            menu    : {},
            actions : {}
        },
        treeInit   : function(ctx)
        {
            this._superApply(arguments);
            initContextMenu(
                ctx.tree,
                // ctx.options.contextMenu.selector || "fancytree-title",
                ctx.options.contextMenu.selector || 'fancytree-node',
                ctx.options.contextMenu.menu,
                ctx.options.contextMenu.actions
            );
        }
    });
})(jQuery, document);
