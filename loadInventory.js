const fetch = require("node-fetch");
const fs = require("fs");

const runPrebuild = async () => {
    const response = await fetch(
        "https://sandbox.dev.clover.com/v3/merchants/J9MV77D46ST91/items?access_token=582540d1-2fa6-dd03-7699-e107e6c03c0d&limit=20",
        {
            method: "GET",
            headers: {
                Accept: "application/json",
            },
        }
    )
        .then((response) => response.json())
        .catch((err) => console.log(err));

    const itemsChanged = [];

    response.elements.forEach((item) => {
        let fileData;
        let itemChanged = false;

        try {
            fileData = JSON.parse(
                fs.readFileSync(`./src/pages/inventory/${item.id}.json`, "utf-8")
            );

            for (var key of Object.keys(item)) {
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

    if (itemsChanged.length > 0) {
        const treeItems = [];

        if (!process.env.GITHUB_API_TOKEN) {
            console.error("Github API Token not set");
            return;
        }

        try {
            for (const item of itemsChanged) {
                const itemPath = `src/pages/inventory/${item.id}.json`;

                treeItems.push({
                    path: itemPath,
                    mode: "100644",
                    type: "blob",
                    content: JSON.stringify(item),
                });
            }

            const gitRefResponse = await fetch(
                "https://api.github.com/repos/nasnyder91/gatsby-netlify-cms-template/git/ref/heads/master"
            ).then((response) => response.json());

            // console.log(gitRefResponse.object);

            const postTreeBody = {
                tree: treeItems,
                base_tree: gitRefResponse.object.sha,
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
                }
            ).then((response) => response.json());

            // console.log("TREE: ", treeResponse);

            const commitBody = {
                message: `${itemsChanged.length} items synced from Clover API`,
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
                }
            ).then((response) => response.json());

            // console.log(commitResponse);

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
                }
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
                }
            );

            // console.log(cancelDeployResponse);

            console.log("Successfully committed new inventory items and cancelled current deploy");
        } catch (err) {
            console.error("Could not successfully add new inventory items", err);
        }
    }
};

runPrebuild();
