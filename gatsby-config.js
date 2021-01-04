const path = require('path');

module.exports = {
    siteMetadata: {
        title: "Gatsby + Netlify CMS Starter",
        description:
            "This repo contains an example business website that is built with Gatsby, and Netlify CMS.It follows the JAMstack architecture by using Git as a single source of truth, and Netlify for continuous deployment, and CDN distribution.",
    },
    plugins: [
        "gatsby-plugin-react-helmet",
        "gatsby-plugin-sass",
        `gatsby-plugin-typescript`,
        "gatsby-plugin-sharp",
        {
            resolve: `gatsby-plugin-alias-imports`,
            options: {
              alias: {
                "~components": path.resolve(__dirname, "src/components"),
                "~interfaces": path.resolve(__dirname, "src/interfaces"),
                "~hooks": path.resolve(__dirname, "src/hooks"),
                "~img": path.resolve(__dirname, "src/img"),
                "~pages": path.resolve(__dirname, "src/pages"),
                "~styles": path.resolve(__dirname, "src/styles"),
                "~templates": path.resolve(__dirname, "src/templates"),
                "~utils": path.resolve(__dirname, "src/utils"),
              },
              extensions: []
            }
        },
        "gatsby-transformer-sharp",
        {
            // keep as first gatsby-source-filesystem plugin for gatsby image support
            resolve: "gatsby-source-filesystem",
            options: {
                path: `${__dirname}/static/img`,
                name: "uploads",
            },
        },
        {
            resolve: "gatsby-source-filesystem",
            options: {
                path: `${__dirname}/src/pages`,
                name: "pages",
            },
        },
        {
            resolve: "gatsby-source-filesystem",
            options: {
                path: `${__dirname}/src/img`,
                name: "images",
            },
        },
        {
            resolve: "gatsby-transformer-remark",
            options: {
                plugins: [
                    {
                        resolve: "gatsby-remark-relative-images",
                        options: {
                            name: "uploads",
                        },
                    },
                    {
                        resolve: "gatsby-remark-images",
                        options: {
                            // It's important to specify the maxWidth (in pixels) of
                            // the content container as this plugin uses this as the
                            // base for generating different widths of each image.
                            maxWidth: 2048,
                        },
                    },
                    {
                        resolve: "gatsby-remark-copy-linked-files",
                        options: {
                            destinationDir: "static",
                        },
                    },
                ],
            },
        },
        `gatsby-transformer-json`,
        {
            resolve: "gatsby-plugin-netlify-cms",
            options: {
                modulePath: `${__dirname}/src/cms/cms.js`,
            },
        },
        {
            resolve: "gatsby-plugin-purgecss", // purges all unused/unreferenced css rules
            options: {
                develop: false,
                purgeOnly: ["/all.scss"], // applies purging only on the bulma css file
            },
        }, // must be after other CSS plugins
        "gatsby-plugin-netlify", // make sure to keep it last in the array
    ],
};
