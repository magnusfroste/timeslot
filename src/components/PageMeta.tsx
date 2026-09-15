import { Helmet } from "react-helmet-async";

const SITE_URL = "https://www.timeslot.fit";

interface PageMetaProps {
  title: string;
  description: string;
  path: string;
  noindex?: boolean;
}

const PageMeta = ({ title, description, path, noindex }: PageMetaProps) => {
  const url = `${SITE_URL}${path}`;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {noindex ? <meta name="robots" content="noindex, follow" /> : null}
    </Helmet>
  );
};

export default PageMeta;
