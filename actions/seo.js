const JOBSEOTITLE =
  " | Sarkari Result | Infinite Career | Govt Jobs | Sarkari Naukri | Sarkari Job | Infinite";
const SEODESCRIPTIONSUFFIX =
  ", Check Eligibility, Exam Date, Age Limit, Notification, Online Form, Last Date | Sarkari Result | Govt jobs | Infinite Career | Infinite Careers | Infinite | Sarkari Job";
const SEODESCRIPTIONPREFIX = "Apply Online For ";
const VACANCYSEOTITLTESUFFIX =
  " Recruitment 2020 | Sarkari Result | Infinite Career | Govt Jobs | Result 2020";
const METADATA =
  "infinite career, Sarkari Result, Govt Jobs, Sarkariresult, Sarkari naurki, infinite careers | Result 2020";
const TAG =
  "infinite career, Sarkari Result, Govt Jobs, Sarkariresult, Sarkari naurki, infinite careers | Result 2020";
const KEYWORDS =
  "infinite career, Sarkari Result, Govt Jobs, Sarkariresult, Sarkari naurki, infinite careers | Result 2020";

export function updateJobSEO(job) {
  if (job != null) {
    if (job.seo == null) {
      AppendJobSEOObject(job);
    } else {
      job.seo.title = job.companyDetails.title + JOBSEOTITLE;
      job.seo.description =
        SEODESCRIPTIONPREFIX + job.companyDetails.title + SEODESCRIPTIONSUFFIX;
      job.seo.keywords = KEYWORDS;
      job.seo.tag = TAG;
      job.seo["meta-data"] = METADATA;
    }

    if (job.vacancyDetail != null && job.vacancyDetail.length > 0) {
      UpdateVacancySEO(job);
    }
  }

  //sitemap.push(job);
}

function AppendJobSEOObject(job) {
  job.seo = {
    description:
      SEODESCRIPTIONPREFIX + job.companyDetails.title + SEODESCRIPTIONSUFFIX,
    keywords: KEYWORDS,
    tag: TAG,
    title: job.companyDetails.title + JOBSEOTITLE
  };
}

function UpdateVacancySEO(job) {
  job.vacancyDetail.forEach(vacancy => {
    if (vacancy.seo != null) {
      vacancy.seo.title = vacancy.position + VACANCYSEOTITLTESUFFIX;
      vacancy.seo.description =
        SEODESCRIPTIONPREFIX +
        job.companyDetails.companyName +
        vacancy.position +
        SEODESCRIPTIONSUFFIX;
      vacancy.seo.keywords = KEYWORDS;
      vacancy.seo.tag = TAG;
      vacancy.seo["meta-data"] = METADATA;
    } else {
      AppendVacancyDetailsSEOObject(job, vacancy);
    }
  });
}

function AppendVacancyDetailsSEOObject(job, vacancy) {
  vacancy.seo = {
    description:
      SEODESCRIPTIONPREFIX +
      job.companyDetails.companyName +
      vacancy.position +
      SEODESCRIPTIONSUFFIX,
    keywords: KEYWORDS,
    tag: TAG,
    title:
      job.companyDetails.companyName +
      " " +
      vacancy.position +
      VACANCYSEOTITLTESUFFIX,
    "meta-data": METADATA
  };
}
