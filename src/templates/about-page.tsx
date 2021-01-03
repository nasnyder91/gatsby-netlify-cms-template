import React from "react";
import { graphql } from "gatsby";
import Layout from "~components/layout";
import { HTMLContent } from "~components/content";

interface AboutPageTemplateProps {
    content: string;
    contentComponent?: typeof HTMLContent;
    title: string;
}

export const AboutPageTemplate: React.FC<AboutPageTemplateProps> = ({ title, content, contentComponent }) => {
    const PageContent = contentComponent || HTMLContent;

    return (
        <section className="section section--gradient">
            <div className="container">
                <div className="columns">
                    <div className="column is-10 is-offset-1">
                        <div className="section">
                            <h2 className="title is-size-3 has-text-weight-bold is-bold-light">{title}</h2>
                            <PageContent cssClassName="content" content={content} />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

interface AboutPageProps {
    data: any;
}

const AboutPage: React.FC<AboutPageProps> = ({ data }) => {
    const { markdownRemark: post } = data;

    return (
        <Layout>
            <AboutPageTemplate contentComponent={HTMLContent} title={post.frontmatter.title} content={post.html} />
        </Layout>
    );
};

export default AboutPage;

export const aboutPageQuery = graphql`
    query AboutPage($id: String!) {
        markdownRemark(id: { eq: $id }) {
            html
            frontmatter {
                title
            }
        }
    }
`;
