import express from "express";
import fs from "fs";
import path from "path";
import ReactDOMServer from "react-dom/server";
import axios from "axios";
require("dotenv").config();

// import App from "../src/App";
const PORT = process.env.PORT;
const app = express();

// Homepage
app.get("/", (req, res, next) => {
  fs.readFile(
    path.resolve("./build/index.html"),
    "utf8",
    async (err, htmlData) => {
      if (err) {
        console.error("Error during file reading", err);
        return res.status(404).end();
      }

      try {
        return res.send(
          htmlData
            .replace(
              "<title>Ring of Hires</title>",
              `<title>Home | Ring of Hires</title>`
            )
            .replace(
              "__META_DESCRIPTION__",
              "Ring of Hires is a map-based job search platform for healthcare jobs. All Medical and Dental jobs are covered! Map it out! Over 100,000 jobs listed. Search jobs near you!"
            )
            .replace(
              "__META_KEYWORDS__",
              "Healthcare Professionals,Job Seekers,Looking to Hire"
            )
        );
      } catch (err) {
        return res.status(404).end();
      }
    }
  );
});

//Sitemap
app.get("/sitemap.xml", (req, res, next) => {
  fs.readFile(
    path.resolve("./build/sitemap.xml"),
    "utf8",
    async (err, htmlData) => {
      if (err) {
        console.error("Error during file reading", err);
        return res.status(404).end();
      }

      try {
        return res.send(htmlData);
      } catch (err) {
        return res.status(404).end();
      }
    }
  );
});

//Job Details page
app.get("/job-details/:id", (req, res, next) => {
  const site_url = process.env.SITE_URL;
  const id = req.params.id;
  const api_url = `${process.env.API_URL}jobs/${id && id}`;

  if (true) {
    axios.get(api_url).then(function (data) {
      if (data.data.data.id) {
        let empType = data?.data?.data?.job_type_label;
        let finalEmpType = empType
          ? empType.map((single_jobtype) => single_jobtype?.name)
          : "";

        //Filter array of __EDUCATION_REQUIREMENTS__
        let educationReq = data?.data?.data?.qualification_label;
        let finalEduReq = educationReq
          ? educationReq.map((single_edureq) => single_edureq?.name)
          : "";

        //Filter array of __JOB_BENEFITS__
        let jobBenefits = data?.data?.data?.benefit_label;
        let finalJobBenefits = jobBenefits
          ? jobBenefits.map((single_job_benefits) => single_job_benefits)
          : "";

        //Format the job posted date
        let posted_date = data?.data?.data?.created_at;
        let date_only = posted_date?.slice(0, 10);

        //Format the job posted valid date
        let valid_till = data?.data?.data?.valid_through;
        let valid_upto = valid_till?.slice(0, 10);

        //Limit job description
        let initialJobDes = data?.data?.data?.description;
        let afterJobDes = initialJobDes.replace(/(<([^>]+)>)/gi, "");

        fs.readFile(
          path.resolve("./build/index.html"),
          "utf8",
          async (err, htmlData) => {
            if (err) {
              console.error("Error during file reading", err);
              return res.status(404).end();
            }
            // let html_data = htmlData;

            try {
              return res.send(
                htmlData
                  .replace(
                    "<title>Ring of Hires</title>",
                    `<title>${
                      data?.data?.data?.job_title
                        ? data?.data?.data?.job_title
                        : data?.data?.data?.position_label
                    } | Ring of Hires</title>`
                  )
                  .replace(
                    "__META_DESCRIPTION__",
                    data?.data?.data?.meta_details?.meta_description
                  )
                  .replace(
                    "__META_KEYWORDS__",
                    data?.data?.data?.meta_details?.meta_keywords
                  )
                  .replace(
                    "<script></script>",
                    `<script type="application/ld+json">
          {
            "@context": "https://schema.org",
            "@type": "JobPosting",
            "hiringOrganization": "${data?.data?.data?.company_name}",
            "title": "${
              data?.data?.data?.job_title
                ? data?.data?.data?.job_title
                : data?.data?.data?.position_label
            }",
            "description": "${afterJobDes}",
            "totalJobOpenings": "${data?.data?.data?.no_of_hires}",
            "datePosted": "${date_only}",
            "url": "${site_url}/job-details/${id}",
            "image": "${
              data?.data?.data?.image
                ? data?.data?.data?.image
                : data?.data?.data?.emp_id == null
                ? data?.data?.data?.category_unverified_image
                : data?.data?.data?.category_verified_image
            }",
            "employmentType": "${finalEmpType}",
            "educationRequirements": "${finalEduReq}",
            "jobBenefits": "${finalJobBenefits}",
            "validThrough": "${valid_upto}",
            "jobLocation": {
              "@type": "Place",
              "address": {
              "@type": "PostalAddress",
              "addressLocality": "${
                data?.data?.data?.location_details?.address
              }"
              }
            }
          }
          </script>`
                  )
              );
            } catch (err) {
              return res.status(404).end();
            }
          }
        );
      } else {
        fs.readFile(
          path.resolve("./build/index.html"),
          "utf8",
          async (err, htmlData) => {
            if (err) {
              console.error("Error during file reading", err);
              return res.status(404).end();
            }

            try {
              return res.send(
                htmlData.replace(
                  "<title>Ring of Hires</title>",
                  `<title>Home | Ring of Hires</title>`
                )
              );
            } catch (err) {
              return res.status(404).end();
            }
          }
        );
      }
      //Filter array of __EMPLOYMENT_TYPE__
    });
  } else {
    fs.readFile(
      path.resolve("./build/index.html"),
      "utf8",
      async (err, htmlData) => {
        if (err) {
          console.error("Error during file reading", err);
          return res.status(404).end();
        }

        try {
          return res.send(
            htmlData.replace(
              "<title>Ring of Hires</title>",
              `<title>Home | Ring of Hires</title>`
            )
          );
        } catch (err) {
          return res.status(404).end();
        }
      }
    );
  }
});

//Job Search without query parameter
app.get("/jobSearch", (req, res, next) => {
  fs.readFile(
    path.resolve("./build/index.html"),
    "utf8",
    async (err, htmlData) => {
      if (err) {
        console.error("Error during file reading", err);
        return res.status(404).end();
      }
      // let html_data = htmlData;

      try {
        return res.send(
          htmlData
            .replace(
              "<title>Ring of Hires</title>",
              `<title>Jobsearch | Ring of Hires</title>`
            )
            .replace(
              "https://www.ringofhires.com",
              `https://www.ringofhires.com/jobSearch`
            )
        );
      } catch (err) {
        return res.status(404).end();
      }
    }
  );
});

//Job Search with query parameter page
app.get("/jobSearch/:optional", (req, res, next) => {
  const optional = req.params.optional;

  function toTitleCase(str) {
    if (str) {
      var wordsArray = str.toLowerCase().split(/\s+/);
      var upperCased = wordsArray.map(function (word) {
        return word.charAt(0).toUpperCase() + word.substr(1);
      });
      return upperCased.join(" ");
    }
  }

  const url_category = toTitleCase(
    optional?.split("jobs")[0]?.replace(/-/g, " ")
  )?.trim();
  const url_address = toTitleCase(
    optional?.split("jobs-in-")[1]?.replace(/-/g, "-")
  );

  //Removing "-" and make the first letter capital for address starts here
  let metaTitleOne = url_address;
  let metaTitleTwo = metaTitleOne?.split("-")?.join(" ");
  let metaTitleThree = metaTitleTwo?.split(" ");

  for (var i = 0; i < metaTitleThree?.length; i++) {
    metaTitleThree[i] =
      metaTitleThree[i]?.charAt(0)?.toUpperCase() + metaTitleThree[i]?.slice(1);
  }

  let metaTitleFour = metaTitleThree?.join(" ");
  //Ends here

  const api_url = `${process.env.API_URL}google-indexing?${
    url_category && `position=${url_category}`
  }&${metaTitleFour && `location=${metaTitleFour}`}`;
  console.log(api_url);

  const response = axios.get(api_url).then(function (data) {
    fs.readFile(
      path.resolve("./build/index.html"),
      "utf8",
      async (err, htmlData) => {
        if (err) {
          console.error("Error during file reading", err);
          return res.status(404).end();
        }
        // let html_data = htmlData;

        try {
          return res.send(
            htmlData
              .replace(
                "<title>Ring of Hires</title>",
                `<title>${
                  url_category && metaTitleFour
                    ? url_category + " Jobs in " + metaTitleFour
                    : metaTitleFour
                    ? "Jobs in " + metaTitleFour
                    : url_category
                    ? url_category + " Jobs"
                    : "Jobsearch"
                }| Ring of Hires</title>`
              )
              .replace(
                "https://www.ringofhires.com",
                `https://www.ringofhires.com/jobSearch`
              )
              .replace(
                "__META_DESCRIPTION__",
                data.data?.meta_description ? data.data?.meta_description : ""
              )
              .replace(
                "__META_KEYWORDS__",
                data.data?.meta_keywords ? data.data?.meta_keywords : ""
              )
          );
        } catch (err) {
          return res.status(404).end();
        }
      }
    );
  });
});

//Hire Search page
app.get("/hireSearch/:optional", (req, res, next) => {
  fs.readFile(
    path.resolve("./build/index.html"),
    "utf8",
    async (err, htmlData) => {
      if (err) {
        console.error("Error during file reading", err);
        return res.status(404).end();
      }
      try {
        return res.send(
          htmlData.replace(
            "<title>Ring of Hires</title>",
            `<title>Hiresearch | Ring of Hires</title>`
          )
        );
      } catch (err) {
        return res.status(404).end();
      }
    }
  );
});

// Inner Static Pages
app.get("/:page", (req, res, next) => {
  //Removing - from the page title and make the first letter capital
  let pageTitleOne = req.params.page;
  let pageTitleTwo = pageTitleOne.split("-").join(" ");
  let pageTitleThree = pageTitleTwo.split(" ");

  for (var i = 0; i < pageTitleThree.length; i++) {
    pageTitleThree[i] =
      pageTitleThree[i].charAt(0).toUpperCase() + pageTitleThree[i].slice(1);
  }

  let pageTitleFour = pageTitleThree.join(" ");

  fs.readFile(
    path.resolve("./build/index.html"),
    "utf8",
    async (err, htmlData) => {
      if (err) {
        console.error("Error during file reading", err);
        return res.status(404).end();
      }

      try {
        return res.send(
          htmlData
            .replace(
              "<title>Ring of Hires</title>",
              `<title>${
                pageTitleFour != "Index.html" ? pageTitleFour : "Home"
              } | Ring of Hires</title>`
            )
            .replace(
              "__META_DESCRIPTION__",
              "Ring of Hires is a map-based job search platform for healthcare jobs. All Medical and Dental jobs are covered! Map it out! Over 100,000 jobs listed. Search jobs near you!"
            )
            .replace(
              "__META_KEYWORDS__",
              `${
                req.params.page != "index.html"
                  ? req.params.page
                  : "Healthcare Professionals,Job Seekers,Looking to Hire"
              }`
            )
        );
      } catch (err) {
        return res.status(404).end();
      }
    }
  );
});

// Profile page
app.get("/profile/:random", (req, res, next) => {
  fs.readFile(
    path.resolve("./build/index.html"),
    "utf8",
    async (err, htmlData) => {
      if (err) {
        console.error("Error during file reading", err);
        return res.status(404).end();
      }

      try {
        return res.send(htmlData);
      } catch (err) {
        return res.status(404).end();
      }
    }
  );
});

// Edit Profile page
app.get("/profile/job-edit/:id", (req, res, next) => {
  fs.readFile(
    path.resolve("./build/index.html"),
    "utf8",
    async (err, htmlData) => {
      if (err) {
        console.error("Error during file reading", err);
        return res.status(404).end();
      }

      try {
        return res.send(htmlData);
      } catch (err) {
        return res.status(404).end();
      }
    }
  );
});

// Candidate page
app.get("/applications/:id", (req, res, next) => {
  fs.readFile(
    path.resolve("./build/index.html"),
    "utf8",
    async (err, htmlData) => {
      if (err) {
        console.error("Error during file reading", err);
        return res.status(404).end();
      }

      try {
        return res.send(htmlData);
      } catch (err) {
        return res.status(404).end();
      }
    }
  );
});

// Employee profile page
app.get("/employees/:id", (req, res, next) => {
  fs.readFile(
    path.resolve("./build/index.html"),
    "utf8",
    async (err, htmlData) => {
      if (err) {
        console.error("Error during file reading", err);
        return res.status(404).end();
      }

      try {
        return res.send(htmlData);
      } catch (err) {
        return res.status(404).end();
      }
    }
  );
});

// Employer profile page
app.get("/employers/:id", (req, res, next) => {
  fs.readFile(
    path.resolve("./build/index.html"),
    "utf8",
    async (err, htmlData) => {
      if (err) {
        console.error("Error during file reading", err);
        return res.status(404).end();
      }

      try {
        return res.send(htmlData);
      } catch (err) {
        return res.status(404).end();
      }
    }
  );
});

// Employee job application
app.get("/profile/employees/job-applications", (req, res, next) => {
  fs.readFile(
    path.resolve("./build/index.html"),
    "utf8",
    async (err, htmlData) => {
      if (err) {
        console.error("Error during file reading", err);
        return res.status(404).end();
      }

      try {
        return res.send(htmlData);
      } catch (err) {
        return res.status(404).end();
      }
    }
  );
});

// Reset password page
app.get("/reset-password/:uid/:token", (req, res, next) => {
  fs.readFile(
    path.resolve("./build/index.html"),
    "utf8",
    async (err, htmlData) => {
      if (err) {
        console.error("Error during file reading", err);
        return res.status(404).end();
      }

      try {
        return res.send(htmlData);
      } catch (err) {
        return res.status(404).end();
      }
    }
  );
});

// Scrapped job job detail page
app.get("/employers-details/:random_company_name", (req, res, next) => {
  fs.readFile(
    path.resolve("./build/index.html"),
    "utf8",
    async (err, htmlData) => {
      if (err) {
        console.error("Error during file reading", err);
        return res.status(404).end();
      }

      try {
        return res.send(htmlData);
      } catch (err) {
        return res.status(404).end();
      }
    }
  );
});

// Set password via admin panel
app.get("/set-password/:uid/:token/:user_id", (req, res, next) => {
  fs.readFile(
    path.resolve("./build/index.html"),
    "utf8",
    async (err, htmlData) => {
      if (err) {
        console.error("Error during file reading", err);
        return res.status(404).end();
      }

      try {
        return res.send(htmlData);
      } catch (err) {
        return res.status(404).end();
      }
    }
  );
});

// Activate account
app.get("/activate-account/:uid/:token", (req, res, next) => {
  fs.readFile(
    path.resolve("./build/index.html"),
    "utf8",
    async (err, htmlData) => {
      if (err) {
        console.error("Error during file reading", err);
        return res.status(404).end();
      }

      try {
        return res.send(htmlData);
      } catch (err) {
        return res.status(404).end();
      }
    }
  );
});

// Access profile via admin panel
app.get("/user/access-profile", (req, res, next) => {
  fs.readFile(
    path.resolve("./build/index.html"),
    "utf8",
    async (err, htmlData) => {
      if (err) {
        console.error("Error during file reading", err);
        return res.status(404).end();
      }

      try {
        return res.send(htmlData);
      } catch (err) {
        return res.status(404).end();
      }
    }
  );
});

// Unsubscribe Newsletter
app.get("/unsubscribedailycandidates/:user_role/:uid/:token/:email_template", (req, res, next) => {
  fs.readFile(
    path.resolve("./build/index.html"),
    "utf8",
    async (err, htmlData) => {
      if (err) {
        console.error("Error during file reading", err);
        return res.status(404).end();
      }

      try {
        return res.send(htmlData);
      } catch (err) {
        return res.status(404).end();
      }
    }
  );
});

app.use(express.static(path.resolve(__dirname, "..", "build")));

app.listen(PORT, () => {
  console.log(`App launched on ${PORT}`);
});
