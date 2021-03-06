const _ = require("lodash");
const path = require("path");
const { createFilePath } = require("gatsby-source-filesystem");
const { fmImagesToRelative } = require("gatsby-remark-relative-images");
const showdown = require("showdown");

const mdConverter = new showdown.Converter();

exports.onCreateWebpackConfig = ({ actions }) => {
    actions.setWebpackConfig({
        resolve: {
            alias: {
                "~components": path.resolve(__dirname, "src/components"),
            },
        },
    });
};

exports.createPages = ({ actions, graphql }) => {
    const { createPage } = actions;

    const inventoryQuery = graphql(`
        {
            allInventoryJson(filter: { active: { eq: true } }) {
                edges {
                    node {
                        id
                    }
                }
            }
        }
    `).then((result) => {
        if (result.errors) {
            result.errors.forEach((e) => console.error("ERROR: ", e.toString()));
            return Promise.reject(result.errors);
        }
        const inventoryItems = result.data.allInventoryJson.edges;

        inventoryItems.forEach((item) => {
            const id = item.node.id;
            createPage({
                path: "/items/" + id,
                // tags: edge.node.frontmatter.tags,
                component: path.resolve(`src/templates/inventory-item-page.tsx`),
                // additional data can be passed via context
                context: {
                    id,
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
                component: path.resolve(`src/templates/${String(edge.node.frontmatter.templateKey)}.tsx`),
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

    if (node.internal.type === "InventoryJson") {
        const convertedMD = mdConverter.makeHtml(node.description);

        const relativeImagePath = `../../../static${node.image}`;

        createNodeField({
            node,
            name: "image",
            value: relativeImagePath,
        });

        createNodeField({
            node,
            name: "htmlDescription",
            value: convertedMD,
        });
    }
};
