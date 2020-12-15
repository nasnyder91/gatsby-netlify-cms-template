const _ = require("lodash");
const path = require("path");
const { createFilePath } = require("gatsby-source-filesystem");
const { fmImagesToRelative } = require("gatsby-remark-relative-images");
const fetch = require("node-fetch");

exports.sourceNodes = async ({ actions, cache, createNodeId, createContentDigest }) => {
    const { createNode } = actions;

    const response = await fetch(
        "https://sandbox.dev.clover.com/v3/merchants/J9MV77D46ST91/items?access_token=582540d1-2fa6-dd03-7699-e107e6c03c0d&limit=5",
        {
            method: "GET",
            headers: {
                Accept: "application/json",
            },
        }
    )
        .then((response) => response.json())
        .catch((err) => console.log(err));

    response.elements.forEach((item) => {
        createNode({
            ...item,
            id: item.id,
            parent: null,
            children: [],
            internal: {
                type: "CloverInventoryItems",
                contentDigest: createContentDigest(item),
            },
        });
    });

    // console.log(response.elements);
};

exports.createPages = ({ actions, graphql }) => {
    const { createPage } = actions;

    const inventoryQuery = graphql(`
        {
            allCloverInventoryItems {
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
            result.errors.forEach((e) => console.error(e.toString()));
            return Promise.reject(result.errors);
        }

        const inventoryItems = result.data.allCloverInventoryItems.edges;

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

    if (node.internal.type === "CloverInventoryItems") {
        // const fileNode = getNode(node.parent);
        // console.log("\n", createFilePath({ node, getNode }));
        // const path = createFilePath({
        //     node,
        //     getNode,
        // });
        // createNodeField({
        //     name: "inventory",
        //     node,
        //     path: `/data/inventory`,
        // });
        // const textNode = {
        //     id: `${node.id}-MarkdownBody`,
        //     parent: node.id,
        //     dir: path.resolve("./src/data/inventory"),
        //     internal: {
        //         type: `${node.internal.type}MarkdownBody`,
        //         mediaType: "text/markdown",
        //         content: node.body,
        //         // contentDigest: digest(node.body),
        //     },
        // };
        // createNode(textNode);
        // // Create markdownBody___NODE field
        // createNodeField({
        //     node,
        //     name: "markdownBody___NODE",
        //     value: textNode.id,
        // });
    }
};
