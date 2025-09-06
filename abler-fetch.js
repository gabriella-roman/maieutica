const fetch = require("node-fetch"); // se usar node-fetch v2

const TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJjb21wYW55X2lkIjo1MzY5LCJ0aW1lc3RhbXAiOiIyMDI0LTExLTEzIDE1OjA0OjMzICswMDAwIn0.Q9pi9ZEkowhG5YQ3RPstft5m2NhR8rw-NCPVNPiQ0y4";

fetch("https://api.abler.com.br/v1/vacancies?released=true&status=published&include=responsible,level_of_interest,area_of_interests", {
  headers: {
    Authorization: `Bearer ${TOKEN}`,
    "Content-Type": "application/json"
  }
})
  .then(res => res.json())
  .then(json => {
    const includedMap = new Map();
    json.included?.forEach(item => {
      includedMap.set(`${item.type}-${item.id}`, item.attributes);
    });

    const enriched = json.data.map(item => {
      const relationships = item.relationships;
      const enrichedRels = {};

      for (const [key, rel] of Object.entries(relationships)) {
        if (!rel?.data) continue;
        if (Array.isArray(rel.data)) {
          enrichedRels[key] = rel.data.map(d => ({
            id: d.id,
            type: d.type,
            attributes: includedMap.get(`${d.type}-${d.id}`) || {}
          }));
        } else {
          const d = rel.data;
          enrichedRels[key] = {
            id: d.id,
            type: d.type,
            attributes: includedMap.get(`${d.type}-${d.id}`) || {}
          };
        }
      }

      return {
        id: item.id,
        title: item.attributes?.title,
        attributes: item.attributes,
        relationships: enrichedRels
      };
    });

    console.dir(enriched, { depth: null });
  });
