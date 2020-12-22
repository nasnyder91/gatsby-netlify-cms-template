import React from "react";
import { graphql } from "gatsby";
import Layout from "../components/layout";
import { HTMLContent } from "../components/content";

interface CheckoutPageTemplateProps {
    content: string;
    contentComponent?: typeof HTMLContent;
    title: string;
}

export const CheckoutPageTemplate: React.FC<CheckoutPageTemplateProps> = ({
                                                                        title,
                                                                        content,
                                                                        contentComponent,
                                                                    }) => {
    const PageContent = contentComponent || HTMLContent;

    return (
        <section className="section section--gradient">
            <div className="container">
                <div className="columns">
                    <div className="column is-10 is-offset-1">
                        <div className="section">
                            <h2 className="title is-size-3 has-text-weight-bold is-bold-light">
                                {title}
                            </h2>
                            <PageContent cssClassName="content" content={content} />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

interface CheckoutPageProps {
    data: any;
}

const CheckoutPage: React.FC<CheckoutPageProps> = ({ data }) => {
    const { markdownRemark: post } = data;

    return (
        <Layout>
            <CheckoutPageTemplate
                contentComponent={HTMLContent}
                title={post.frontmatter.title}
                content={post.html}
            />
        </Layout>
    );
};

export default CheckoutPage;

export const checkoutPageQuery = graphql`
    query CheckoutPage($id: String!) {
        markdownRemark(id: { eq: $id }) {
            html
            frontmatter {
                title
            }
        }
    }
`;
