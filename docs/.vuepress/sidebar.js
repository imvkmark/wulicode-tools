module.exports = {
    "/": ["/readme.md"],
    "/project/": [
        "/project/readme.md",
        "/project/install.md",
        "/project/config.md",
        "/project/best-practice.md",
        "/project/fe-mix.md",
        "/project/fe-backend.md",
        "/project/code-review.md",
    ],
    "/framework/": [
        "/framework/readme.md",
        "/framework/config.md",
        "/framework/extension.md",
        "/framework/tree.md",
        "/framework/resp.md",
        "/framework/build.md",
        "/framework/plan.md",
    ],
    "/module/": [
        "/module/readme.md",
        "/module/action.md",
        "/module/apidoc.md",
        "/module/event.md",
        "/module/hook.md",
        "/module/lang.md",
        "/module/menus.md",
        "/module/models.md",
        "/module/permission.md",
        "/module/policy.md",
        "/module/progress.md",
        "/module/qa.md",
    ],
    "/poppy/": [
        "/poppy/readme.md",
        {
            text: "System",
            collapsable: true,
            sidebarDepth: 2,
            children: [
                "/poppy/system/readme.md",
                "/poppy/system/config.md",
                "/poppy/system/middlewares.md"
            ],
        },
        {
            text: "Core",
            collapsable: true,
            sidebarDepth: 2,
            children: [
                "/poppy/core/readme.md",
                "/poppy/core/cache.md",
                "/poppy/core/config.md",
                "/poppy/core/sami.md"
            ],
        },
        {
            text: "Mgr-Page",
            collapsable: true,
            sidebarDepth: 2,
            children: [
                "/poppy/mgr-page/readme.md"
            ],
        },
        {
            text: "CanalEs",
            collapsable: true,
            sidebarDepth: 2,
            children: [
                "/poppy/canal-es/readme.md"
            ],
        },
    ],
    "/vendor/": ["/vendor/code-review.md"],
};
