import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { graphql } from "gatsby";
import Layout from "~components/layout";
import Content, { HTMLContent } from "~components/content";
import PreviewCompatibleImage from "~components/preview-compatible-image";
import InventoryItem from "~interfaces/inventory-item";
import Breadcrumbs from "~components/breadcrumbs";

interface InventoryItemTemplateProps {
    item: InventoryItem;
    contentComponent?: typeof Content;
    // tags: Array<string>;
    helmet?: any;
    isCmsPreview?: boolean;
}

export const InventoryItemTemplate: React.FC<InventoryItemTemplateProps> = ({
    item,
    contentComponent,
    // tags,
    helmet,
    isCmsPreview,
}) => {
    const PostContent = contentComponent || Content;

    const [currentStock, setCurrentStock] = useState(-1);

    useEffect(() => {
        if (!isCmsPreview) {
            fetch(`/.netlify/functions/retrieve-item-stock?id=${item.id}`)
                .then((response) => response.json())
                .then((result) => setCurrentStock(result.stockCount))
                .catch((err) => console.log(err));
        }
    }, []);

    return (
        <section className="section">
            {helmet || ""}
            <div className="container">
                <Breadcrumbs
                    breadcrumbs={[
                        { href: `/inventory`, name: "Store" },
                        { href: `/items/${item.id}`, name: item.title },
                    ]}
                />
                <div className="content">
                    <div className="columns">
                        <div className="column is-10 is-offset-1">
                            <h1 className="title is-size-2 has-text-weight-bold is-bold-light">{item.title}</h1>
                            <div className="columns">
                                <div className="column is-4">
                                    <PreviewCompatibleImage
                                        imageInfo={{
                                            image: item.fields?.image ?? item.image,
                                            alt: `image of ${item.title}`,
                                        }}
                                    />
                                </div>
                                <div className="column is-offset-1 is-7">
                                    <PostContent content={item.fields?.htmlDescription ?? item.description} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

interface InventoryItemProps {
    data: { inventoryJson: any };
}

const InventoryItemPage: React.FC<InventoryItemProps> = ({ data }) => {
    const { inventoryJson: item } = data;

    return (
        <Layout>
            <InventoryItemTemplate
                item={item}
                contentComponent={HTMLContent}
                helmet={
                    <Helmet titleTemplate="%s | Store">
                        <title>{`${item.name}`}</title>
                        <meta name="description" content={`${item.description}`} />
                    </Helmet>
                }
                // tags={item.frontmatter.tags}
            />
        </Layout>
    );
};

export default InventoryItemPage;

export const pageQuery = graphql`
    query InventoryItemByID($id: String!) {
        inventoryJson(id: { eq: $id }) {
            id
            name
            title
            sku
            price
            description
            fields {
                image {
                    childImageSharp {
                        fluid {
                            ...GatsbyImageSharpFluid
                        }
                    }
                }
                htmlDescription
            }
        }
    }
`;
