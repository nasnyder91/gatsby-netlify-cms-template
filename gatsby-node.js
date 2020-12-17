const _ = require("lodash");
const path = require("path");
const { createFilePath } = require("gatsby-source-filesystem");
const { fmImagesToRelative } = require("gatsby-remark-relative-images");
const fetch = require("node-fetch");
const fs = require("fs");

// exports.onPreBootstrap = async () => {
//     const response = await fetch(
//         "https://sandbox.dev.clover.com/v3/merchants/J9MV77D46ST91/items?access_token=582540d1-2fa6-dd03-7699-e107e6c03c0d&limit=10",
//         {
//             method: "GET",
//             headers: {
//                 Accept: "application/json",
//             },
//         }
//     )
//         .then((response) => response.json())
//         .catch((err) => console.log(err));

//     response.elements.forEach((item) => {
//         let fileData;
//         let itemObject;

//         try {
//             fileData = fs.readFileSync(`./src/pages/inventory/${item.id}.json`, "utf-8");
//         } catch {
//             fileData = {
//                 title: item.name,
//                 active: false,
//                 description: "",
//                 image: null,
//                 templateKey: "inventory-item-template",
//             };
//         }

//         itemObject = { ...fileData, ...item };

//         try {
//             fs.writeFileSync(
//                 `./src/pages/inventory/${item.id}.json`,
//                 JSON.stringify(itemObject),
//                 "utf-8"
//             );
//         } catch {
//             console.log(`Could not write file for item with name ${item.name} and id ${item.id}`);
//         }
//     });
// };

exports.sourceNodes = async ({ actions, cache, createNodeId, createContentDigest }) => {
    // const response = await fetch(
    //     "https://sandbox.dev.clover.com/v3/merchants/J9MV77D46ST91/items?access_token=582540d1-2fa6-dd03-7699-e107e6c03c0d&limit=10",
    //     {
    //         method: "GET",
    //         headers: {
    //             Accept: "application/json",
    //         },
    //     }
    // )
    //     .then((response) => response.json())
    //     .catch((err) => console.log(err));
    // // response.elements.forEach(async (item) => {
    // //     await fs.readFile(`./src/pages/inventory/${item.id}.json`, "utf-8", async (err, data) => {
    // //         let itemObject;
    // //         if (!err) {
    // //             itemObject = { ...JSON.parse(data), ...item };
    // //         } else {
    // //             itemObject = {
    // //                 ...item,
    // //                 title: item.name,
    // //                 active: false,
    // //                 description: "",
    // //                 image: null,
    // //                 templateKey: "inventory-item-template",
    // //             };
    // //         }
    // //         await fs.writeFile(
    // //             `./src/pages/inventory/${item.id}.json`,
    // //             JSON.stringify(itemObject),
    // //             "utf-8",
    // //             (err) => {
    // //                 if (err) {
    // //                     console.log(err);
    // //                 }
    // //             }
    // //         );
    // //     });
    // // });
    // response.elements.forEach((item) => {
    //     let fileData;
    //     let itemObject;
    //     try {
    //         fileData = fs.readFileSync(`./src/pages/inventory/${item.id}.json`, "utf-8");
    //     } catch {
    //         fileData = {
    //             title: item.name,
    //             active: false,
    //             description: "",
    //             image: null,
    //             templateKey: "inventory-item-template",
    //         };
    //     }
    //     itemObject = { ...fileData, ...item };
    //     try {
    //         fs.writeFileSync(
    //             `./src/pages/inventory/${item.id}.json`,
    //             JSON.stringify(itemObject),
    //             "utf-8"
    //         );
    //     } catch {
    //         console.log();
    //     }
    // });
};

exports.createPages = ({ actions, graphql }) => {
    const { createPage } = actions;

    const inventoryQuery = graphql(`
        {
            allInventoryJson {
                edges {
                    node {
                        id
                        hidden
                        name
                        code
                        sku
                        price
                        stockCount
                    }
                }
            }
        }
    `).then((result) => {
        if (result.errors) {
            result.errors.forEach((e) => console.error("ERROR: ", e.toString()));
            return Promise.reject(result.errors);
        }
        console.log(result);
        const inventoryItems = result.data.allInventoryJson.edges;

        inventoryItems.forEach((item) => {
            const id = item.node.id;
            createPage({
                path: "/items/" + id,
                // tags: edge.node.frontmatter.tags,
                component: path.resolve(`src/templates/inventory-item-template.tsx`),
                // additional data can be passed via context
                context: {
                    ...item,
                },
            });
        });
    });

    const markdownRemarkQuery = graphql(`
        {
            allMarkdownRemark(limit: 1000) {
                edges {
                    node {
                        id
                        fields {
                            slug
                        }
                        frontmatter {
                            tags
                            templateKey
                        }
                    }
                }
            }
        }
    `).then((result) => {
        if (result.errors) {
            result.errors.forEach((e) => console.error(e.toString()));
            return Promise.reject(result.errors);
        }

        const posts = result.data.allMarkdownRemark.edges;

        posts.forEach((edge) => {
            const id = edge.node.id;
            createPage({
                path: edge.node.fields.slug,
                tags: edge.node.frontmatter.tags,
                component: path.resolve(
                    `src/templates/${String(edge.node.frontmatter.templateKey)}.tsx`
                ),
                // additional data can be passed via context
                context: {
                    id,
                },
            });
        });

        // Tag pages:
        let tags = [];
        // Iterate through each post, putting all found tags into `tags`
        posts.forEach((edge) => {
            if (_.get(edge, `node.frontmatter.tags`)) {
                tags = tags.concat(edge.node.frontmatter.tags);
            }
        });
        // Eliminate duplicate tags
        tags = _.uniq(tags);

        // Make tag pages
        tags.forEach((tag) => {
            const tagPath = `/tags/${_.kebabCase(tag)}/`;

            createPage({
                path: tagPath,
                component: path.resolve(`src/templates/tags.tsx`),
                context: {
                    tag,
                },
            });
        });
    });

    return Promise.all([markdownRemarkQuery, inventoryQuery]);
};

exports.onCreateNode = ({ node, actions, getNode }) => {
    const { createNodeField, createNode } = actions;
    fmImagesToRelative(node); // convert image paths for gatsby images

    if (node.internal.type === `MarkdownRemark`) {
        const value = createFilePath({ node, getNode });
        createNodeField({
            name: `slug`,
            node,
            value,
        });
    }
};
