import ImageInfo from "~interfaces/image-info";
import React from "react";
import PreviewCompatibleImage from "~components/preview-compatible-image";

interface FeatureGridProps {
    gridItems: Array<{ image: {} | string; text: string }>;
}

const getImageInfo = (item): ImageInfo => {
    return {
        alt: item.text,
        image: item.image,
    };
};

const FeatureGrid: React.FC<FeatureGridProps> = ({ gridItems }) => (
    <div className="columns is-multiline">
        {gridItems.map((item) => (
            <div key={item.text} className="column is-6">
                <section className="section">
                    <div className="has-text-centered">
                        <div
                            style={{
                                width: "240px",
                                display: "inline-block",
                            }}>
                            <PreviewCompatibleImage imageInfo={getImageInfo(item)} />
                        </div>
                    </div>
                    <p>{item.text}</p>
                </section>
            </div>
        ))}
    </div>
);

export default FeatureGrid;
