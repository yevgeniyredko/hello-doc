const testCases = [
    {
        eventPack: task1(),
        expectedResult: {
            documentType: "Draft",
            direction: "Outgoing",
            documentNumber: "ПРЕФ5-12",
            totalSum: 0.48,
            status: "Draft",
        }
    },
    {
        eventPack: task2(),
        expectedResult: {
            documentType: "Document",
            direction: "Outgoing",
            documentNumber: "СОЛО-15",
            totalSum: 322.0,
            status: "InvalidSignature",
        }
    },
    {
        eventPack: task3(),
        expectedResult: {
            documentType: "Document",
            direction: "Outgoing",
            documentNumber: "МЕМ-1",
            totalSum: 15478.0,
            status: "InvalidReceiptSignature",
        }
    },
    {
        eventPack: task4(),
        expectedResult: {
            documentType: "Document",
            direction: "Outgoing",
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
];
