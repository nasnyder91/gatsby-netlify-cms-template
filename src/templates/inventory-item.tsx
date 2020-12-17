import React from "react";
import { kebabCase } from "lodash";
import { Helmet } from "react-helmet";
import { graphql, Link } from "gatsby";
import Layout from "../components/layout";
import { HTMLContent } from "../components/content";

interface InventoryItemTemplateProps {
    content: React.FC;
    contentComponent?: typeof HTMLContent;
    description: string;
    // tags: Array<string>;
    title: string;
    helmet?: any;
}

export const InventoryItemTemplate: React.FC<InventoryItemTemplateProps> = ({
    content,
    contentComponent,
    description,
    // tags,
    title,
    helmet,
}) => {
    const PostContent = contentComponent || HTMLContent;

    return (
        <section className="section">
            {helmet || ""}
            <div className="container content">
                <div className="columns">
                    <div className="column is-10 is-offset-1">
                        <h1 className="title is-size-2 has-text-weight-bold is-bold-light">
                            {title}
                        </h1>
                        <p>{description}</p>
                        <PostContent content={content} />
                        {/* {tags && tags.length ? (
                            <div style={{ marginTop: `4rem` }}>
                                <h4>Tags</h4>
                                <ul className="taglist">
                                    {tags.map((tag) => (
                                        <li key={tag + `tag`}>
                                            <Link to={`/tags/${kebabCase(tag)}/`}>{tag}</Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ) : null} */}
                    </div>
                </div>
            </div>
        </section>
    );
};

interface InventoryItemProps {
    data: { inventoryJson: any };
}

const InventoryItem: React.FC<InventoryItemProps> = ({ data }) => {
    const { inventoryJson: item } = data;

    return (
        <Layout>
            <InventoryItemTemplate
                content={item.description}
                contentComponent={HTMLContent}
                description={item.description}
                helmet={
                    <Helmet titleTemplate="%s | Store">
                        <title>{`${item.name}`}</title>
                        <meta name="description" content={`${item.description}`} />
                    </Helmet>
                }
                // tags={item.frontmatter.tags}
                title={item.title}
            />
        </Layout>
    );
};

export default InventoryItem;

export const pageQuery = graphql`
    query InventoryItemByID($id: String!) {
        inventoryJson(id: { eq: $id }) {
            id
            name
            sku
            price
            description
        }
    }
`;
// export const pageQuery = graphql`
//     query InventoryItemByID($id: String!) {
//         inventoryJson(id: { eq: $id }) {
//             id
//             name
//             sku
//             price
//             description
//             image {
//                 childImageSharp {
//                     fluid(maxWidth: 2048, quality: 100) {
//                         ...GatsbyImageSharpFluid
//                     }
//                 }
//             }
//         }
//     }
// `;
