import api from "../utils/api";

type Job = {
  title: string;
  description: string;
  location: string;
  area: string;
  salary: string;
  contractingRegime: string;
  slugLink: string;
};

export async function fetchJobs(): Promise<Job[]> {
  const response = await api.get("/vacancies", {
    params: {
      released: "true",
      status: "published",
      per_page: 10,
      page: 1,
    },
  });

  const jobData = response.data?.data ?? [];

  return jobData.map(mapApiJobToJob);
}

function mapApiJobToJob(job: any): Job {
  return {
    title: job.attributes?.title || "Título não informado",
    description: job.attributes?.description || "Descrição não informada",
    location: job.attributes?.address?.data?.id || "Localização não informada",
    area: job.attributes?.area_of_interests?.data?.[0]?.id || "Área não informada",
    salary: job.attributes?.salary || "Salário não informado",
    contractingRegime: job.attributes?.contracting_regime || "Regime não informado",
    slugLink: job.attributes?.slug || "slug-nao-informado",
  };
}
