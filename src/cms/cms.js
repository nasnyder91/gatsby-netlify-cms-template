import CMS from "netlify-cms-app";
import uploadcare from "netlify-cms-media-library-uploadcare";
import cloudinary from "netlify-cms-media-library-cloudinary";

import AboutPagePreview from "./preview-templates/AboutPagePreview";
import BlogPostPreview from "./preview-templates/BlogPostPreview";
import ProductPagePreview from "./preview-templates/ProductPagePreview";
import IndexPagePreview from "./preview-templates/IndexPagePreview";
import InventoryItemPreview from "./preview-templates/InventoryItemPreview";

import CloverSyncLogTitle from "./custom-widgets/clover-sync/clover-sync-log-title";
import CloverSyncLogDescription from "./custom-widgets/clover-sync/clover-sync-log-description";

CMS.registerMediaLibrary(uploadcare);
CMS.registerMediaLibrary(cloudinary);

CMS.registerPreviewTemplate("index", IndexPagePreview);
CMS.registerPreviewTemplate("about", AboutPagePreview);
CMS.registerPreviewTemplate("products", ProductPagePreview);
CMS.registerPreviewTemplate("blog", BlogPostPreview);
CMS.registerPreviewTemplate("inventory", InventoryItemPreview);

CMS.registerWidget("clover-sync-log-title", CloverSyncLogTitle);
CMS.registerWidget("clover-sync-log-description", CloverSyncLogDescription);
