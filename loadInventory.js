const fetch = require("node-fetch");
const fs = require("fs");
const glob = require("glob");

const runPrebuild = async () => {
    const response = await fetch(
        "https://sandbox.dev.clover.com/v3/merchants/J9MV77D46ST91/items?access_token=582540d1-2fa6-dd03-7699-e107e6c03c0d&limit=500",
        {
            method: "GET",
            headers: {
                Accept: "application/json",
            },
        },
    );

    if (!response.ok) {
        return {
            statusCode: 422,
            body: `Clover API responded with status code: ${response.status}`,
        };
    }

    const results = await response.json();

    const itemsChanged = [];
    const itemsRemoved = [];

    results.elements.forEach((item) => {
        let fileData;
        let itemChanged = false;

        try {
            fileData = JSON.parse(fs.readFileSync(`./src/pages/inventory/${item.id}.json`, "utf-8"));

            for (const key of Object.keys(item)) {
                if (item[key] !== fileData[key]) {
                    itemChanged = true;
                    break;
                }
            }
        } catch {
            itemChanged = true;
            fileData = {
                title: item.name,
                active: false,
                description: "description",
                image: "/img/placeholder.png",
                templateKey: "inventory-item-template",
            };
        }

        if (itemChanged) {
            itemsChanged.push({ ...fileData, ...item });
        }
    });

    glob.sync("./src/pages/inventory/*.json").forEach((file) => {
        const itemId = file.split("/").pop().split(".")[0];

        if (results.elements.find((item) => item.id === itemId) == null) {
            const item = JSON.parse(fs.readFileSync(file, "utf-8"));
            itemsRemoved.push({ ...item });
        }
    });

    if (itemsChanged.length > 0 || itemsRemoved.length > 0) {
        const treeItems = [];

        if (!process.env.GITHUB_API_TOKEN) {
            console.error("Github API Token not set");
            return;
        }

        try {
            const gitRefResponse = await fetch(
                "https://api.github.com/repos/nasnyder91/gatsby-netlify-cms-template/git/ref/heads/master",
                {
                    headers: {
                        Accept: "application/vnd.github.v3+json",
                        Authorization: `token ${process.env.GITHUB_API_TOKEN}`,
                    },
                },
            ).then((response) => response.json());

            // console.log(gitRefResponse);

            const gitLatestCommitResponse = await fetch(
                `https://api.github.com/repos/nasnyder91/gatsby-netlify-cms-template/git/commits/${gitRefResponse.object.sha}`,
                {
                    headers: {
                        Accept: "application/vnd.github.v3+json",
                        Authorization: `token ${process.env.GITHUB_API_TOKEN}`,
                    },
                },
            ).then((response) => response.json());

            // console.log("LATEST COMMIT: ", gitLatestCommitResponse);

            const gitLatestCommitTreeResponse = await fetch(
                `https://api.github.com/repos/nasnyder91/gatsby-netlify-cms-template/git/trees/${gitLatestCommitResponse.tree.sha}?recursive=1`,
                {
                    headers: {
                        Accept: "application/vnd.github.v3+json",
                        Authorization: `token ${process.env.GITHUB_API_TOKEN}`,
                    },
                },
            ).then((response) => response.json());

            let tree = gitLatestCommitTreeResponse.tree;

            // console.log("TREE:  ", gitLatestCommitTreeResponse);

            if (itemsChanged.length > 0) {
                for (const item of itemsChanged) {
                    const itemPath = `src/pages/inventory/${item.id}.json`;

                    const itemIndex = tree.findIndex((i) => i.path.includes(item.id));
                    console.log("BEFORE: ", tree[itemIndex]);

                    if (itemIndex > -1) {
                        tree[itemIndex] = {
                            path: itemPath,
                            mode: "100644",
                            type: "blob",
                            content: JSON.stringify(item),
                        };
                    }
                    console.log("AFTER: ", tree[itemIndex]);
                }
            }

            if (itemsRemoved.length > 0) {
                tree = tree.filter((item) => !itemsRemoved.some((i) => item.path.includes(i.id)));
            }
            // console.log(gitRefResponse.object);

            tree = tree.filter((blob) => blob.type !== "tree");

            const postTreeBody = {
                tree: tree,
                // base_tree: gitLatestCommitTreeResponse.sha,
            };
            const treeResponse = await fetch(
                "https://api.github.com/repos/nasnyder91/gatsby-netlify-cms-template/git/trees",
                {
                    method: "POST",
                    headers: {
                        Accept: "application/vnd.github.v3+json",
                        Authorization: `token ${process.env.GITHUB_API_TOKEN}`,
                    },
                    body: JSON.stringify(postTreeBody),
                },
            ).then((response) => response.json());

            // console.log("TREE: ", treeResponse);

            const commitBody = {
                message: `Synced with Clover API. ${itemsChanged.length} items updated/created. ${itemsRemoved.length} items removed.`,
                tree: treeResponse.sha,
                parents: [gitRefResponse.object.sha],
            };
            const commitResponse = await fetch(
                "https://api.github.com/repos/nasnyder91/gatsby-netlify-cms-template/git/commits",
                {
                    method: "POST",
                    headers: {
                        Accept: "application/vnd.github.v3+json",
                        Authorization: `token ${process.env.GITHUB_API_TOKEN}`,
                    },
                    body: JSON.stringify(commitBody),
                },
            ).then((response) => response.json());

            console.log(commitResponse);

            const updateRefBody = {
                sha: commitResponse.sha,
            };
            const updateRefResponse = await fetch(
                "https://api.github.com/repos/nasnyder91/gatsby-netlify-cms-template/git/refs/heads/master",
                {
                    method: "PATCH",
                    headers: {
                        Accept: "application/vnd.github.v3+json",
                        Authorization: `token ${process.env.GITHUB_API_TOKEN}`,
                    },
                    body: JSON.stringify(updateRefBody),
                },
            ).then((response) => response.json());

            // console.log(updateRefResponse);

            const cancelDeployResponse = await fetch(
                `https://api.netlify.com/api/v1/deploys/${process.env.DEPLOY_ID}/cancel`,
                {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        Authorization: `bearer ${process.env.NETLIFY_API_TOKEN}`,
                    },
                },
            );

            // console.log(cancelDeployResponse);

            console.log("Successfully committed new inventory items and cancelled current deploy");
        } catch (err) {
            console.error("Could not successfully add new inventory items", err);
        }
    } else {
        console.log("Inventory is already up to date");
    }
};

runPrebuild();
