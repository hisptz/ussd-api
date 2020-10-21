export const configurations = [
    {
        message: "{orgUnit.name} {orgUnit.code}. Hongera kwa kutuma taarifa za mwezi wa {period}. Duka lako linafanya vizuri na linatoa huduma kwa kufuata miongozo iliyowekwa na wizara ya afya.",
        conditions: ["BRGJJBdawSe", "VnDKBTKGizy"],
        otherConditions: {
            orCL6SVj4Ia: ["BRGJJBdawSe", "VnDKBTKGizy","{key} < 0"],
            ZbAecP9kMrx: ["BRGJJBdawSe", "VnDKBTKGizy", "{key} < 0"],
            tjIEQUUM2Ti: ["BRGJJBdawSe", "VnDKBTKGizy", "{key} < 0"],
            tWTENPrPRQJ: ["BRGJJBdawSe", "VnDKBTKGizy", "{key} < 0"]
        }
    },
    {
        message: "{orgUnit.name} {orgUnit.code}. Hongera kwa kutuma taarifa za mwezi {period}. Takwimu zako zinaonesha unafuata miongozo iliyotolewa na wizara ya afya isipokuwa, baadhi ya watoto wenye nimonia hawakupewa Amox-DT.",
        conditions: [],
        otherConditions: {
            tWTENPrPRQJ: ["yFvwGue43EQ", "C0m3Tnw9rDu", "z7yljE98jsl"]
        },
    },
    {
        message: "{orgUnit.name} {orgUnit.code}. Hongera kwa kutuma taarifa za mwezi {period}. Takwimu zako zinaonesha umefuata miongozo iliyotolewa na wizara ya afya isipokuwa, baadhi ya watoto wenye kuhara hawakupewa ZINC na ORS.",
        conditions: [],
        otherConditions: {
            tjIEQUUM2Ti: ["yFvwGue43EQ", "C0m3Tnw9rDu", "z7yljE98jsl"]
        },
    },
    {
        message: "{orgUnit.name} {orgUnit.code}. Hongera kwa kutuma taarifa za mwezi {period}. Takwimu zako zinaonesha umefuata miongozo ya wizara ya afya isipokuwa, waliopewa ALU ni wengi kuliko wenye majibu chanya.",
        conditions: [],
        otherConditions: {
            orCL6SVj4Ia: ["yFvwGue43EQ", "C0m3Tnw9rDu", "z7yljE98jsl"]
        },
    },
    {
        message: "{orgUnit.name} {orgUnit.code}. Hongera kwa kutuma taarifa za mwezi {period}. Takwimu zako zinaonesha kuwa umefuata miongozo ya wizara ya afya isipokuwa, idadi ya wagonjwa wenye homa ni kubwa sana. Hakikisha homa hizo zinathibitishwa kwa kutumia kipima joto.",
        conditions: [],
        otherConditions: {
            H9KUB8rcui9: ["yFvwGue43EQ", "C0m3Tnw9rDu", "z7yljE98jsl"]
        },
    },
    {
        message: "{orgUnit.name} {orgUnit.code}. Hongera kwa kutuma taarifa za mwezi {period}. Takwimu zako zinaonesha waliopewa ALU ni wengi kuliko wenye majibu chanya pia wagonjwa wenye homa wamekuwa wengi. Hakikisha unathibitisha homa hizo kwa kutumia kipima joto.",
        conditions: [],
        otherConditions: {
            H9KUB8rcui9: ["yFvwGue43EQ", "C0m3Tnw9rDu", "z7yljE98jsl"],
            orCL6SVj4Ia: ["yFvwGue43EQ", "C0m3Tnw9rDu", "z7yljE98jsl"]
        },
    },
    //Starting Here
    {
        message: "{orgUnit.name} {orgUnit.code}. Hongera kwa kutuma taarifa za mwezi {period}. Takwimu zako zinaonesha dawa mseto ya Malaria ilitolewa kwa wagonjwa ambao hawakuwa na majibu ya Malaria pia wagonjwa wenye homa wamekuwa wengi. Hakikisha unathibitisha homa hizo kwa kutumia kipima joto.",
        conditions: [],
        otherConditions: {
            H9KUB8rcui9: ["yFvwGue43EQ", "C0m3Tnw9rDu", "z7yljE98jsl"],
            ZbAecP9kMrx: ["yFvwGue43EQ", "C0m3Tnw9rDu", "z7yljE98jsl"]
        },
    },
    {
        message: "{orgUnit.name} {orgUnit.code}. Hongera kwa kutuma taarifa za mwezi {period}. Takwimu zako zinaonesha baadhi ya watoto wenye nimonia hawakupewa Amox DT pia wagonjwa wenye homa wamekuwa wengi. Hakikisha unathibitisha homa hizo kwa kutumia kipima joto.",
        conditions: [],
        otherConditions: {
            H9KUB8rcui9: ["yFvwGue43EQ", "C0m3Tnw9rDu", "z7yljE98jsl"],
            tWTENPrPRQJ: ["yFvwGue43EQ", "C0m3Tnw9rDu", "z7yljE98jsl"]
        },
    },
    {
        message: "{orgUnit.name} {orgUnit.code}. Hongera kwa kutuma taarifa za mwezi {period}. Takwimu zako zinaonesha baadhi ya watoto wenye kuhara hawakupewa ZINC na ORS, pia wagonjwa wenye homa wamekuwa wengi. Hakikisha unathibitisha homa hizo kwa kutumia kipima joto.",
        conditions: [],
        otherConditions: {
            H9KUB8rcui9: ["yFvwGue43EQ", "C0m3Tnw9rDu", "z7yljE98jsl"],
            tjIEQUUM2Ti: ["yFvwGue43EQ", "C0m3Tnw9rDu", "z7yljE98jsl"]
        },
    },
    {
        message: "{orgUnit.name} {orgUnit.code}. Hongera kwa kutuma taarifa za mwezi {period}. Takwimu zako zinaonesha waliopewa ALU ni wengi kuliko wenye majibu chanya pia baadhi ya watoto wenye kuhara hawakupewa ZINC na ORS",
        conditions: [],
        otherConditions: {
            tjIEQUUM2Ti: ["yFvwGue43EQ", "C0m3Tnw9rDu", "z7yljE98jsl"],
            orCL6SVj4Ia: ["yFvwGue43EQ", "C0m3Tnw9rDu", "z7yljE98jsl"]
        },
    },
    {
        message: "{orgUnit.name} {orgUnit.code}. Hongera kwa kutuma taarifa za mwezi {period}. Takwimu zako zinaonesha waliopewa ALU ni wengi kuliko wenye majibu chanya pia’ dawa mseto ilitolewa kwa wagonjwa ambao hawakuwa na majibu ya Malaria.",
        conditions: [],
        otherConditions: {
            orCL6SVj4Ia: ["yFvwGue43EQ", "C0m3Tnw9rDu", "z7yljE98jsl"],
            ZbAecP9kMrx: ["yFvwGue43EQ", "C0m3Tnw9rDu", "z7yljE98jsl"]
        },
    },
    {
        message: "{orgUnit.name} {orgUnit.code}. Hongera kwa kutuma taarifa za mwezi {period}. Takwimu zako zinaonesha waliopewa ALU ni wengi kuliko wenye majibu chanya pia baadhi ya watoto wenye nimonia hawakupewa Amox DT.",
        conditions: [],
        otherConditions: {
            tWTENPrPRQJ: ["yFvwGue43EQ", "C0m3Tnw9rDu", "z7yljE98jsl"],
            orCL6SVj4Ia: ["yFvwGue43EQ", "C0m3Tnw9rDu", "z7yljE98jsl"]
        },
    },
    {
        message: "{orgUnit.name} {orgUnit.code}. Hongera kwa kutuma taarifa za mwezi {period}. Takwimu zako zinaonesha dawa mseto ilitolewa kwa wagonjwa ambao hawakuwa na majibu ya Malaria pia baadhi ya watoto wenye nimonia hawakupewa Amox DT.",
        conditions: [],
        otherConditions: {
            ZbAecP9kMrx: ["yFvwGue43EQ", "C0m3Tnw9rDu", "z7yljE98jsl"],
            tWTENPrPRQJ: ["yFvwGue43EQ", "C0m3Tnw9rDu", "z7yljE98jsl"]
        },
    },
    {
        message: "{orgUnit.name} {orgUnit.code}. Hongera kwa kutuma taarifa za mwezi {period}. Takwimu zako zinaonesha dawa mseto ilitolewa kwa wagonjwa ambao hawakuwa na majibu ya Malaria pia baadhi ya watoto wenye kuhara hawakupewa ZINC na ORS.",
        conditions: [],
        otherConditions: {
            ZbAecP9kMrx: ["yFvwGue43EQ", "C0m3Tnw9rDu", "z7yljE98jsl"],
            tjIEQUUM2Ti: ["yFvwGue43EQ", "C0m3Tnw9rDu", "z7yljE98jsl"]
        },
    },
    {
        message: "{orgUnit.name} {orgUnit.code}. Hongera kwa kutuma taarifa za mwezi {period}. Takwimu zako zinaonesha baadhi ya watoto wenye kuhara hawakupewa ZINC na ORS na baadhi ya watoto wenye nimonia hawakupewa Amox DT.",
        conditions: [],
        otherConditions: {
            tWTENPrPRQJ: ["yFvwGue43EQ", "C0m3Tnw9rDu", "z7yljE98jsl"],
            tjIEQUUM2Ti: ["yFvwGue43EQ", "C0m3Tnw9rDu", "z7yljE98jsl"]
        },
    },
    {
        message: "{orgUnit.name} {orgUnit.code}. Hongera kwa kutuma taarifa za mwezi {period}. Takwimu zako zinaonesha dawa mseto ilitolewa kwa wagonjwa ambao hawakuwa na majibu ya malaria, wagonjwa wenye homa wamekuwa wengi. Hakikisha unathibitisha homa hizo kwa kutumia kipima joto. Pia imeonekana waliopewa ALU ni wengi kuliko wenye majibu chanya.",
        conditions: [],
        otherConditions: {
            H9KUB8rcui9: ["yFvwGue43EQ", "C0m3Tnw9rDu", "z7yljE98jsl"],
            orCL6SVj4Ia: ["yFvwGue43EQ", "C0m3Tnw9rDu", "z7yljE98jsl"],
            ZbAecP9kMrx: ["yFvwGue43EQ", "C0m3Tnw9rDu", "z7yljE98jsl"]
        },
    },
    {
        message: "{orgUnit.name} {orgUnit.code}. Hongera kwa kutuma taarifa za mwezi {period}. Takwimu zako zinaonesha,baadhi ya watoto wenye nimonia hawakupewa Amox DT,  imeonekana waliopewa ALU ni wengi kuliko wenye majibu chanya, wagonjwa wenye homa wamekuwa wengi. Hakikisha unathibitisha homa hizo kwa kutumia kipima joto.",
        conditions: [],
        otherConditions: {
            H9KUB8rcui9: ["yFvwGue43EQ", "C0m3Tnw9rDu", "z7yljE98jsl"],
            orCL6SVj4Ia: ["yFvwGue43EQ", "C0m3Tnw9rDu", "z7yljE98jsl"],
            tWTENPrPRQJ: ["yFvwGue43EQ", "C0m3Tnw9rDu", "z7yljE98jsl"]
        },
    },
    {
        message: "{orgUnit.name} {orgUnit.code}. Hongera kwa kutuma taarifa za mwezi {period}. Takwimu zako zinaonesha,baadhi ya watoto wenye kuhara hawakupewa ZINC na ORS,  Pia imeonekana waliopewa ALU ni wengi kuliko wenye majibu chanya, wagonjwa wenye homa wamekuwa wengi. Hakikisha unathibitisha homa hizo kwa kutumia kipima joto.",
        conditions: [],
        otherConditions: {
            H9KUB8rcui9: ["yFvwGue43EQ", "C0m3Tnw9rDu", "z7yljE98jsl"],
            orCL6SVj4Ia: ["yFvwGue43EQ", "C0m3Tnw9rDu", "z7yljE98jsl"],
            tjIEQUUM2Ti: ["yFvwGue43EQ", "C0m3Tnw9rDu", "z7yljE98jsl"]
        },
    },
    {
        message: "{orgUnit.name} {orgUnit.code}. Hongera kwa kutuma taarifa za mwezi {period}. Takwimu zako zinaonesha,baadhi ya watoto wenye nimonia hawakupewa Amox DT,  Pia imeonekana waliopewa ALU ni wengi kuliko wenye majibu chanya, pia dawa mseto ilitolewa kwa wagonjwa ambao hawakuwa na majibu ya Malaria",
        conditions: [],
        otherConditions: {
            orCL6SVj4Ia: ["yFvwGue43EQ", "C0m3Tnw9rDu", "z7yljE98jsl"],
            ZbAecP9kMrx: ["yFvwGue43EQ", "C0m3Tnw9rDu", "z7yljE98jsl"],
            tWTENPrPRQJ: ["yFvwGue43EQ", "C0m3Tnw9rDu", "z7yljE98jsl"]
        },
    },
    {
        message: "{orgUnit.name} {orgUnit.code}. Hongera kwa kutuma taarifa za mwezi {period}. Takwimu zako zinaonesha,baadhi ya watoto wenye kuhara hawakupewa ZINC na ORS,  Pia imeonekana waliopewa ALU ni wengi kuliko wenye majibu chanya, pia dawa mseto ilitolewa kwa wagonjwa ambao hawakuwa na majibu ya Malaria",
        conditions: [],
        otherConditions: {
            orCL6SVj4Ia: ["yFvwGue43EQ", "C0m3Tnw9rDu", "z7yljE98jsl"],
            ZbAecP9kMrx: ["yFvwGue43EQ", "C0m3Tnw9rDu", "z7yljE98jsl"],
            tjIEQUUM2Ti: ["yFvwGue43EQ", "C0m3Tnw9rDu", "z7yljE98jsl"]
        },
    },
    {
        message: "{orgUnit.name} {orgUnit.code}. Hongera kwa kutuma taarifa za mwezi {period}. Takwimu zako zinaonesha,baadhi ya watoto wenye kuhara hawakupewa  ZINC na ORS, na baadhi wenye nimonia hawakupewa Amox DT,  Pia  waliopewa ALU ni wengi kuliko wenye majibu chanya.",
        conditions: [],
        otherConditions: {
            ZbAecP9kMrx: ["yFvwGue43EQ", "C0m3Tnw9rDu", "z7yljE98jsl"],
            tWTENPrPRQJ: ["yFvwGue43EQ", "C0m3Tnw9rDu", "z7yljE98jsl"],
            tjIEQUUM2Ti: ["yFvwGue43EQ", "C0m3Tnw9rDu", "z7yljE98jsl"]
        },
    },
    {
        message: "{orgUnit.name} {orgUnit.code}. Hongera kwa kutuma taarifa za mwezi {period}. Takwimu zako zinaonesha,baadhi ya watoto wenye kuhara hawakupewa  ZINC na ORS, na baadhi wenye nimonia hawakupewa Amox DT,  Pia  waliopewa ALU ni wengi kuliko wenye majibu chanya.",
        conditions: [],
        otherConditions: {
            ZbAecP9kMrx: ["yFvwGue43EQ", "C0m3Tnw9rDu", "z7yljE98jsl"],
            tWTENPrPRQJ: ["yFvwGue43EQ", "C0m3Tnw9rDu", "z7yljE98jsl"],
            tjIEQUUM2Ti: ["yFvwGue43EQ", "C0m3Tnw9rDu", "z7yljE98jsl"]
        },
    },
    {
        message: "{orgUnit.name} {orgUnit.code}. Hongera kwa kutuma taarifa za mwezi {period}. Takwimu zako zinaonesha dawa mseto ilitolewa kwa wagonjwa ambao hawakuwa na majibu ya malaria,waliopewa ALU ni wengi kuliko wenye majibu chanya, baadhi ya watoto  wenye nimonia hawakupewa Amox DT,na idadi ya wenye homa ni kubwa. Hakikisha unathibitisha homa hizo kwa kutumia kipima joto.",
        conditions: [],
        otherConditions: {
            H9KUB8rcui9: ["yFvwGue43EQ", "C0m3Tnw9rDu", "z7yljE98jsl"],
            orCL6SVj4Ia: ["yFvwGue43EQ", "C0m3Tnw9rDu", "z7yljE98jsl"],
            ZbAecP9kMrx: ["yFvwGue43EQ", "C0m3Tnw9rDu", "z7yljE98jsl"],
            tWTENPrPRQJ: ["yFvwGue43EQ", "C0m3Tnw9rDu", "z7yljE98jsl"]
        },
    },
    {
        message: "{orgUnit.name} {orgUnit.code}. Hongera kwa kutuma taarifa za mwezi {period}. Takwimu zako zinaonesha dawa mseto ilitolewa kwa wagonjwa ambao hawakuwa na majibu ya malaria ,waliopewa ALU ni wengi kuliko wenye majibu chanya , baadhi ya watoto  wenye kuhara hawakupewa ZINC na ORS na idadi ya wenye homa ni kubwa. Hakikisha unathibitisha homa hizo kwa kutumia kipima joto.",
        conditions: [],
        otherConditions: {
            H9KUB8rcui9: ["yFvwGue43EQ", "C0m3Tnw9rDu", "z7yljE98jsl"],
            orCL6SVj4Ia: ["yFvwGue43EQ", "C0m3Tnw9rDu", "z7yljE98jsl"],
            ZbAecP9kMrx: ["yFvwGue43EQ", "C0m3Tnw9rDu", "z7yljE98jsl"],
            tjIEQUUM2Ti: ["yFvwGue43EQ", "C0m3Tnw9rDu", "z7yljE98jsl"]
        },
    },
    {
        message: "{orgUnit.name} {orgUnit.code}. Takwimu zako zinaonesha kuwa wagonjwa waliopewa ALU ni wengi kuliko wenye majibu chanya, dawa mseto ilitolewa kwa wagonjwa ambao hawakuwa na majibu ya malaria ,baadhi ya watoto  wenye nimonia hawakupewa Amox DT, baadhi ya watoto  wenye kuhara hawakupewa ZINC na ORS na idadi ya wenye  homa ni kubwa. Hakikisha unathibitisha homa hizo kwa kutumia kipima joto.",
        conditions: [],
        otherConditions: {
            orCL6SVj4Ia: ["yFvwGue43EQ", "C0m3Tnw9rDu", "z7yljE98jsl"],
            ZbAecP9kMrx: ["yFvwGue43EQ", "C0m3Tnw9rDu", "z7yljE98jsl"],
            tjIEQUUM2Ti: ["yFvwGue43EQ", "C0m3Tnw9rDu", "z7yljE98jsl"],
            tWTENPrPRQJ: ["yFvwGue43EQ", "C0m3Tnw9rDu", "z7yljE98jsl"]
        },
    }
];
