import React from "react";

import InventoryListings from "../../components/inventory/inventory-items";
import Layout from "../../components/layout";

export default class InventoryPage extends React.Component {
    render() {
        return (
            <Layout>
                <div
                    className="full-width-image-container margin-top-0"
                    style={{
                        backgroundImage: `url('/img/blog-index.jpg')`,
                    }}>
                    <h1
                        className="has-text-weight-bold is-size-1"
                        style={{
                            boxShadow: "0.5rem 0 0 #f40, -0.5rem 0 0 #f40",
                            backgroundColor: "#f40",
                            color: "white",
                            padding: "1rem",
                        }}>
                        Shop
                    </h1>
                </div>
                <section className="section">
                    <div className="container">
                        <div className="content">
                            <InventoryListings />
                        </div>
                    </div>
                </section>
            </Layout>
        );
    }
}
