const express = require("express");
const authRoute = require("./auth.route");
const configurationRoute = require("./configuration.route");
const uploadGrantRoute = require("./uploadGrant.route");
const uploadRoute = require("./upload.route");
const meRoute = require("./me.route");
const userRoute = require("./user.route");
const staticRoute = require("./static.route");
const whatsHotRoute = require("./whatsHot.route");
const reviewRoute = require("./review.route");
const partnerRoute = require("./partner.route");
const appFeatureRoute = require("./appFeature.route");
const blogCategoryRoute = require("./blogCategory.route");
const blogArticleRoute = require("./blogArticle.route");
const faqRoute = require("./faq.route");
const tutorialRoute = require("./tutorial.route");
const teamMemberRoute = require("./teamMember.route");

const { jsonRouter, useRouter, multipartRouter } = require("../../routers");
const { json } = require("../../config/contentTypes");

const router = express.Router();

useRouter.default(router)("/auth", authRoute);
jsonRouter(router)("/configurations", configurationRoute);
multipartRouter(router)("/upload", uploadRoute);
useRouter(router, json)("/upload-grant", uploadGrantRoute);
useRouter(router, json)("/me", meRoute);
useRouter(router, json)("/users", userRoute);
useRouter(router, json)("/whats-hots", whatsHotRoute);
useRouter(router, json)("/reviews", reviewRoute);
useRouter(router, json)("/partners", partnerRoute);
useRouter(router, json)("/app-features", appFeatureRoute);
useRouter(router, json)("/blog-categories", blogCategoryRoute);
useRouter(router, json)("/blog-articles", blogArticleRoute);
useRouter(router, json)("/faqs", faqRoute);
useRouter(router, json)("/tutorials", tutorialRoute);
useRouter(router, json)("/team-members", teamMemberRoute);

router.use("/static", staticRoute);

module.exports = router;
