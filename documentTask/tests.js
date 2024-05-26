const testCases = [
    {
        eventPack: task1(),
        expectedResult: {
            documentType: "Draft",
            direction: "Outgoing",
            documentNumber: "ИК1-88",
            totalSum: 1000000.48,
            status: "Draft",
        }
    },
    {
        eventPack: task2(),
        expectedResult: {
            documentType: "Document",
            direction: "Incoming",
            documentNumber: "ВОД-15",
            totalSum: 3808.0,
            status: "Delivered",
        }
    },
    {
        eventPack: task3(),
        expectedResult: {
            documentType: "Document",
            direction: "Outgoing",
            documentNumber: "МЕМ-42",
            totalSum: 42.0,
            status: "Delivered",
        }
    },
    {
        eventPack: task4(),
        expectedResult: {
            documentType: "Document",
            direction: "Incoming",
            documentNumber: "1988",
            totalSum: 8008.0,
            status: "DocflowFinished",
        }
    },
    {
        eventPack: task5(),
        expectedResult: {
            documentType: "Document",
            direction: "Outgoing",
            documentNumber: "ПА-5",
            totalSum: 108000.0,
            status: "DocflowRejected",
        }
    },
    {
        eventPack: task6(),
        expectedResult: {
            documentType: "Document",
            direction: "Incoming",
            documentNumber: "ПА-6",
            totalSum: 108000.01,
            status: "DocflowRejected",
        }
    },
];
