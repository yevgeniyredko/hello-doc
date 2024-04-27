function runWorkflow(workflow) {
    const state = createEmptyState();

    for (const event of workflow) {
        runWorkflowEvent(state, event);
        if (state.error != null) {
            return createFailedResult(state.error);
        }
    }

    return createSuccessResult(state.data);
}

function createEmptyState() {
    return {
        appliedEvents: new Set(),
        data: {},
        error: null
    };
}

function createFailedResult(error) {
    return {isSuccess: false, result: error};
}

function createSuccessResult(result) {
    return {isSuccess: true, result: result};
}

function runWorkflowEvent(state, nextEvent) {
    switch (nextEvent.type) {
        case "DocumentCreated": {
            processDocumentCreated(state, nextEvent);
            break;
        }
        case "DocumentReceived": {
            processDocumentReceived(state, nextEvent);
            break;
        }
        case "DocumentSigned": {
            processDocumentSigned(state, nextEvent);
            break;
        }
        case "DocumentSignatureVerified": {
            processDocumentSignatureVerified(state, nextEvent);
            break;
        }
        case "ReceiptSigned": {
            processReceiptSigned(state, nextEvent);
            break;
        }
        case "ReceiptSignatureVerified": {
            processReceiptSignatureVerified(state, nextEvent);
            break;
        }
        case "SignatureRejected": {
            processSignatureRejected(state, nextEvent);
            break;
        }
        case "SignatureRejectionDelivered": {
            processSignatureRejectionDelivered(state, nextEvent);
            break;
        }
        default: {
            state.error = `Unknown event type: ${nextEvent.type}`;
        }
    }
}

function processDocumentCreated(state, event) {
    if (state.appliedEvents.size !== 0) {
        state.error = "DocumentCreated is first event for outgoing documents";
        return;
    }
    state.data.documentType = "Draft";
    state.data.direction = "Outgoing";
    state.data.documentNumber = event.payload.documentNumber;
    state.data.totalSum = event.payload.totalSum;
    state.data.status = "Draft";
    state.appliedEvents.add("DocumentCreated");
}

function processDocumentReceived(state, event) {
    if (state.appliedEvents.size !== 0) {
        state.error = "DocumentReceived is first event for incoming documents";
        return;
    }
    state.data.documentType = "Document";
    state.data.direction = "Incoming";
    state.data.documentNumber = event.payload.documentNumber;
    state.data.totalSum = event.payload.totalSum;
    state.data.status = "Delivered";
    state.appliedEvents.add("DocumentReceived");
}

function processDocumentSigned(state, event) {
    if (state.appliedEvents.size === 0 || !state.appliedEvents.has("DocumentCreated")) {
        state.error = "Create document before signing";
        return;
    }
    if (!(state.data.status === "Draft" || state.data.status === "Signed")) {
        state.error = invalidStatusError(event.type, state.data.status);
        return;
    }
    state.data.documentType = "Document";
    state.data.status = "Signed";
    state.appliedEvents.add("DocumentSigned");
}

function processDocumentSignatureVerified(state, event) {
    if (state.appliedEvents.size === 0 || !state.appliedEvents.has("DocumentSigned")) {
        state.error = "Sign document before verifying signature";
        return;
    }
    if (!(state.data.status === "Signed" || state.data.status === "InvalidSignature")) {
        state.error = invalidStatusError(event.type, state.data.status);
        return;
    }
    if (!event.payload.isSuccess && state.data.status === "Signed") {
        state.data.status = "InvalidSignature";
    }
    if (event.payload.isSuccess) {
        state.data.status = "Delivered";
    }
    state.appliedEvents.add("DocumentSignatureVerified");
}

function processReceiptSigned(state, event) {
    if (state.appliedEvents.size === 0 || !(state.appliedEvents.has("DocumentSignatureVerified") || state.appliedEvents.has("DocumentReceived"))) {
        state.error = "Deliver document before signing receipt";
        return;
    }
    if (state.data.status === "InvalidSignature") {
        state.error = "Document is not delivered";
        return;
    }
    if (state.data.status !== "Delivered") {
        state.error = invalidStatusError(event.type, state.data.status);
        return;
    }
    state.data.status = "ReceiptSigned";
    state.appliedEvents.add("ReceiptSigned");
}

function processReceiptSignatureVerified(state, event) {
    if (state.appliedEvents.size === 0 || !state.appliedEvents.has("ReceiptSigned")) {
        state.error = "Sign receipt before verifying signature";
        return;
    }
    if (!(state.data.status === "ReceiptSigned" || state.data.status === "InvalidReceiptSignature")) {
        state.error = invalidStatusError(event.type, state.data.status);
        return;
    }
    if (!event.payload.isSuccess && state.data.status === "ReceiptSigned") {
        state.data.status = "InvalidReceiptSignature";
    }
    if (event.payload.isSuccess) {
        state.data.status = "DocflowFinished";
    }
    state.appliedEvents.add("ReceiptSignatureVerified");
}

function processSignatureRejected(state, event) {
    if (state.appliedEvents.size === 0 || !state.appliedEvents.has("ReceiptSignatureVerified")) {
        state.error = "Deliver document before rejecting";
        return;
    }
    if (state.data.status === "InvalidSignature") {
        state.error = "Document is not delivered";
        return;
    }
    if (state.data.status !== "DocflowFinished") {
        state.error = invalidStatusError(event.type, state.data.status);
        return;
    }
    state.data.status = "RejectionRequested";
    state.appliedEvents.add("SignatureRejected");
}

function processSignatureRejectionDelivered(state, event) {
    if (state.appliedEvents.size === 0 || !state.appliedEvents.has("SignatureRejected")) {
        state.error = "Reject document before delivering rejection";
        return;
    }
    if (state.data.status !== "RejectionRequested") {
        state.error = invalidStatusError(event.type, state.data.status);
        return;
    }
    state.data.status = "DocflowRejected";
    state.appliedEvents.add("SignatureRejectionDelivered");
}

function invalidStatusError(eventType, status) {
    return `Invalid status for ${eventType}: ${status}`;
}
