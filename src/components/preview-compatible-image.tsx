import React from "react";
import Img from "gatsby-image";
import ImageInfo from "~interfaces/image-info";

interface PreviewCompatibleImageProps {
    imageInfo: ImageInfo;
}

const PreviewCompatibleImage: React.FC<PreviewCompatibleImageProps> = ({
    imageInfo: { alt, childImageSharp, image, style },
}) => {
    if (style == null) {
        style = { borderRadius: "5px" };
    }

    if (!!image && !!image.childImageSharp) {
        return <Img style={style} fluid={image.childImageSharp.fluid} alt={alt} />;
    }

    if (!!childImageSharp) {
        return <Img style={style} fluid={childImageSharp.fluid} alt={alt} />;
    }

    if (!!image && typeof image === "string") {
        return <img style={style} src={image} alt={alt} />;
    }

    return null;
};

export default PreviewCompatibleImage;
