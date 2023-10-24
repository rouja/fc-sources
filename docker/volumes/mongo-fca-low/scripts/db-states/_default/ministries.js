// == MINISTRIES
const ministries = [
  {
    id: "mock-ministere-de-la-transition-ecologique-all-fis-sort-2",
    acronym: "MO1",
    sort: 2,
    name: "MOCK - Ministère de la transition écologique - ALL FIS - SORT 2",
    identityProviders: [
      "9c716f61-b8a1-435c-a407-ef4d677ec270",
      "0e7c099f-fe86-49a0-b7d1-19df45397212",
      "405d3839-9182-415f-9926-597489d11509",
      "4be87184-1052-460b-9e14-3e164f584200",
      "c6ecab5e-dc67-4390-af57-fe208e97b649",
    ],
    updatedAt: new Date("2020-12-09T12:00:00.000Z"),
    createdAt: new Date("2020-12-09T12:00:00.000Z"),
    __v: 1,
  },
  {
    id: "mock-ministere-interieur-some-fis-disabled-sort 1",
    acronym: "MO2",
    sort: 1,
    name: "MOCK - Ministère de l'intérieur - SOME FIS DISABLED - SORT 1",
    identityProviders: [
      "9c716f61-b8a1-435c-a407-ef4d677ec270",
      "405d3839-9182-415f-9926-597489d11509",
      "ccae1186-3695-4ae2-8b38-d3a9926d92c4",
      "b61f31b8-c131-40d0-9eca-109219249db6",
      "56c5831b-7749-4206-b961-11f840bc566b",
    ],
    updatedAt: new Date("2020-12-09T12:00:00.000Z"),
    createdAt: new Date("2020-12-09T12:00:00.000Z"),
    __v: 1,
  },
  {
    id: "mock-ministere-economie-no-fis-sort-3",
    acronym: "MO3",
    sort: 3,
    name: "MOCK - Ministère de l'économie des Finances et de la Relance - NO FIS - SORT 3",
    identityProviders: [],
    updatedAt: new Date("2020-12-09T12:00:00.000Z"),
    createdAt: new Date("2020-12-09T12:00:00.000Z"),
    __v: 1,
  },
  {
    id: "mock-ministere-de-la-mer-e2e-sort-4",
    sort: 4,
    name: "MOCK - Ministère de la mer - E2E - SORT 4",
    identityProviders: [
      "87762a76-7da0-442d-8243-5785f859b88b",
      "46f5d9f9-881d-46b1-bdcc-0548913ea443",
    ],
    updatedAt: new Date("2020-12-09T12:00:00.000Z"),
    createdAt: new Date("2020-12-09T12:00:00.000Z"),
    __v: 1,
  },
  {
    id: "ANSC",
    acronym: "ANSC",
    sort: 4,
    name: "Agence Nationale Sécurité Civile",
    identityProviders: [],
    updatedAt: new Date("2021-01-12T12:00:00.000Z"),
    createdAt: new Date("2021-01-12T12:00:00.000Z"),
    __v: 1,
  },
  {
    id: "SPM",
    acronym: "SPM",
    sort: 5,
    name: "Service du 1er Ministre",
    identityProviders: [],
    updatedAt: new Date("2021-01-12T12:00:00.000Z"),
    createdAt: new Date("2021-01-12T12:00:00.000Z"),
    __v: 1,
  },
  {
    id: "MAE",
    acronym: "MAE",
    sort: 6,
    name: "Ministère des affaires étrangères",
    identityProviders: [],
    updatedAt: new Date("2021-01-12T12:00:00.000Z"),
    createdAt: new Date("2021-01-12T12:00:00.000Z"),
    __v: 1,
  },
  {
    id: "MTE",
    acronym: "MTE",
    sort: 7,
    name: "Ministère de la Transition écologique",
    identityProviders: [],
    updatedAt: new Date("2021-01-12T12:00:00.000Z"),
    createdAt: new Date("2021-01-12T12:00:00.000Z"),
    __v: 1,
  },
  {
    id: "MENJS",
    acronym: "MENJS",
    sort: 8,
    name: "Ministère de l'Éducation nationale,de la Jeunesse et des Sports",
    identityProviders: [],
    updatedAt: new Date("2021-01-12T12:00:00.000Z"),
    createdAt: new Date("2021-01-12T12:00:00.000Z"),
    __v: 1,
  },
  {
    id: "MEFR",
    acronym: "MEFR",
    sort: 9,
    name: "Ministère de l'Économie, des Finances et de la Relance",
    identityProviders: [],
    updatedAt: new Date("2021-01-12T12:00:00.000Z"),
    createdAt: new Date("2021-01-12T12:00:00.000Z"),
    __v: 1,
  },
  {
    id: "MA",
    acronym: "MA",
    sort: 10,
    name: "Ministère des Armées",
    identityProviders: [],
    updatedAt: new Date("2021-01-12T12:00:00.000Z"),
    createdAt: new Date("2021-01-12T12:00:00.000Z"),
    __v: 1,
  },
  {
    id: "MI",
    acronym: "MI",
    sort: 11,
    name: "Ministère de l'intérieur",
    identityProviders: [],
    updatedAt: new Date("2021-01-12T12:00:00.000Z"),
    createdAt: new Date("2021-01-12T12:00:00.000Z"),
    __v: 1,
  },
  {
    id: "MTEI",
    acronym: "MTEI",
    sort: 12,
    name: "Ministère du Travail,de l'Emploi et de l'Insertion",
    identityProviders: [],
    updatedAt: new Date("2021-01-12T12:00:00.000Z"),
    createdAt: new Date("2021-01-12T12:00:00.000Z"),
    __v: 1,
  },
  {
    id: "MOM",
    acronym: "MOM",
    sort: 13,
    name: "Ministère des Outre-mer",
    identityProviders: [],
    updatedAt: new Date("2021-01-12T12:00:00.000Z"),
    createdAt: new Date("2021-01-12T12:00:00.000Z"),
    __v: 1,
  },
  {
    id: "MCTRCT",
    acronym: "",
    sort: 14,
    name: "Ministère de la Cohésion des territoires et des Relationsavec les collectivités territoriales",
    identityProviders: [],
    updatedAt: new Date("2021-01-12T12:00:00.000Z"),
    createdAt: new Date("2021-01-12T12:00:00.000Z"),
    __v: 1,
  },
  {
    id: "MJ",
    acronym: "MJ",
    sort: 15,
    name: "Ministère de la Justice",
    identityProviders: [],
    updatedAt: new Date("2021-01-12T12:00:00.000Z"),
    createdAt: new Date("2021-01-12T12:00:00.000Z"),
    __v: 1,
  },
  {
    id: "MC",
    acronym: "MC",
    sort: 16,
    name: "Ministère de la Culture",
    identityProviders: [],
    updatedAt: new Date("2021-01-12T12:00:00.000Z"),
    createdAt: new Date("2021-01-12T12:00:00.000Z"),
    __v: 1,
  },
  {
    id: "MSS",
    acronym: "MSS",
    sort: 17,
    name: "Ministère des Solidarités et de la Santé",
    identityProviders: [],
    updatedAt: new Date("2021-01-12T12:00:00.000Z"),
    createdAt: new Date("2021-01-12T12:00:00.000Z"),
    __v: 1,
  },
  {
    id: "MM",
    acronym: "",
    sort: 4,
    name: "Ministère de la Mer",
    identityProviders: [],
    updatedAt: new Date("2021-01-12T12:00:00.000Z"),
    createdAt: new Date("2021-01-12T12:00:00.000Z"),
    __v: 1,
  },
  {
    id: "MESRI",
    acronym: "MESRI",
    sort: 19,
    name: "Ministère de l’Enseignement supérieur, de la Recherche et de l'innovation",
    identityProviders: [],
    updatedAt: new Date("2021-01-12T12:00:00.000Z"),
    createdAt: new Date("2021-01-12T12:00:00.000Z"),
    __v: 1,
  },
  {
    id: "MAA",
    acronym: "MAA",
    sort: 20,
    name: "Ministère de l’Agriculture et de l’Alimentation",
    identityProviders: [],
    updatedAt: new Date("2021-01-12T12:00:00.000Z"),
    createdAt: new Date("2021-01-12T12:00:00.000Z"),
    __v: 1,
  },
  {
    id: "MTFP",
    acronym: "MTFP",
    sort: 21,
    name: "Ministère de la Transformation et de la Fonction publiques",
    identityProviders: [],
    updatedAt: new Date("2021-01-12T12:00:00.000Z"),
    createdAt: new Date("2021-01-12T12:00:00.000Z"),
  },
];

// -- MINISTRIES -----
ministries.forEach((ministry) => {
  print(`Initializing Ministry :: ${ministry.id}`);
  const options = { upsert: true };
  const which = { id: ministry.id };
  db.ministries.update(which, ministry, options);
});
