const apiOrigin = (() => {
    const pageUrl = new URL(window.location.href);
    if (pageUrl.hostname === "localhost" || pageUrl.hostname === "127.0.0.1" || pageUrl.protocol === "file:") {
        return `http://${pageUrl.hostname === "127.0.0.1" ? "127.0.0.1" : "localhost"}:8080`;
    }
    return window.location.origin;
})();
const studentApi = `${apiOrigin}/api/student`;
const departmentApi = `${apiOrigin}/api/dept`;

const state = {
    activeTab: "students",
    students: [],
    departments: [],
    search: "",
    editingId: null
};

const tableHead = document.querySelector("#table-head");
const tableBody = document.querySelector("#table-body");
const notice = document.querySelector("#notice");
const recordDialog = document.querySelector("#record-dialog");
const detailsDialog = document.querySelector("#details-dialog");
const recordForm = document.querySelector("#record-form");

async function request(path, options = {}) {
    const method = (options.method || "GET").toUpperCase();
    const url = new URL(path, window.location.href);
    let response;
    try {
        response = await fetch(path, {
            ...options,
            headers: {
                ...(options.body ? { "Content-Type": "application/json" } : {}),
                ...options.headers
            }
        });
    } catch (error) {
        throw new Error(
            `${method} ${url.href} could not be read by the browser. If the page uses a different local port, restart Spring Boot to enable local CORS. (${error.message})`
        );
    }
    const body = await response.text();
    if (!response.ok) {
        let detail = body;
        if (response.headers.get("content-type")?.includes("application/json") && body) {
            try {
                const errorBody = JSON.parse(body);
                detail = errorBody.detail || errorBody.message || errorBody.title || body;
            } catch {
                detail = body;
            }
        } else if (response.headers.get("content-type")?.includes("text/html")) {
            detail = "server returned an HTML error page; check that the page and API are served by the Spring Boot app";
        }
        throw new Error(`${method} ${url.href} failed (${response.status}): ${detail || response.statusText}`);
    }
    if (!body) return null;
    try {
        return JSON.parse(body);
    } catch {
        return body;
    }
}

async function loadData() {
    showNotice("Loading campus records…");
    try {
        const [students, departments] = await Promise.all([
            request(studentApi),
            request(departmentApi)
        ]);
        state.students = Array.isArray(students) ? students : [];
        state.departments = Array.isArray(departments) ? departments : [];
        render();
        hideNotice();
        return true;
    } catch (error) {
        render();
        showNotice(`Could not load campus records: ${error.message}`, "error");
        return false;
    }
}

function render() {
    document.querySelector("#student-count").textContent = state.students.length;
    document.querySelector("#department-count").textContent = state.departments.length;
    document.querySelector("#add-record span").textContent =
        state.activeTab === "students" ? "Add student" : "Add department";

    document.querySelector("#students-tab").classList.toggle("active", state.activeTab === "students");
    document.querySelector("#students-tab").setAttribute("aria-selected", state.activeTab === "students");
    document.querySelector("#departments-tab").classList.toggle("active", state.activeTab === "departments");
    document.querySelector("#departments-tab").setAttribute("aria-selected", state.activeTab === "departments");

    const isStudents = state.activeTab === "students";
    const columns = isStudents
        ? ["ID", "Student", "Age", "Department", "Actions"]
        : ["ID", "Department", "Location", "Students", "Actions"];
    tableHead.replaceChildren();
    const row = document.createElement("tr");
    columns.forEach((column) => {
        const cell = document.createElement("th");
        cell.textContent = column;
        row.append(cell);
    });
    tableHead.append(row);

    const query = state.search.trim().toLowerCase();
    const records = (isStudents ? state.students : state.departments).filter((record) => {
        const department = isStudents ? findStudentDepartment(record.id) : null;
        const searchable = isStudents
            ? [record.id, record.studentName, record.studentAge, department?.deptName]
            : [record.id, record.deptName, record.location];
        return searchable.some((value) => String(value ?? "").toLowerCase().includes(query));
    });

    tableBody.replaceChildren();
    if (!records.length) {
        const emptyRow = document.createElement("tr");
        const emptyCell = document.createElement("td");
        emptyCell.colSpan = columns.length;
        emptyCell.className = "empty-cell";
        emptyCell.textContent = query ? "No records match your search." : `No ${isStudents ? "students" : "departments"} yet. Add one to get started.`;
        emptyRow.append(emptyCell);
        tableBody.append(emptyRow);
    } else {
        records.forEach((record) => tableBody.append(createRecordRow(record, isStudents)));
    }
    document.querySelector("#table-footer").textContent =
        `Showing ${records.length} of ${isStudents ? state.students.length : state.departments.length} ${isStudents ? "students" : "departments"}`;
}

function createRecordRow(record, isStudent) {
    const row = document.createElement("tr");
    const values = isStudent
        ? [record.id, record.studentName, record.studentAge, findStudentDepartment(record.id)?.deptName || "—"]
        : [record.id, record.deptName, record.location, Array.isArray(record.students) ? record.students.length : 0];

    values.forEach((value, index) => {
        const cell = document.createElement("td");
        cell.textContent = value ?? "—";
        if (index === 0) cell.className = "id-cell";
        row.append(cell);
    });

    const actions = document.createElement("td");
    actions.className = "actions";
    actions.append(
        createAction("View", () => viewRecord(record.id, isStudent)),
        createAction("Edit", () => openEditor(record, isStudent)),
        createAction("Delete", () => deleteRecord(record, isStudent), "delete")
    );
    row.append(actions);
    return row;
}

function createAction(label, handler, className = "") {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `action-button ${className}`;
    button.textContent = label;
    button.addEventListener("click", handler);
    return button;
}

function findStudentDepartment(studentId) {
    return state.departments.find((department) =>
        Array.isArray(department.students) &&
        department.students.some((student) => student.id === studentId)
    );
}

function showNotice(message, type = "") {
    notice.textContent = message;
    notice.className = `notice ${type}`.trim();
    notice.hidden = false;
}

function hideNotice() {
    notice.hidden = true;
}

function setTab(tab) {
    state.activeTab = tab;
    document.querySelector("#search").value = "";
    state.search = "";
    render();
}

function openEditor(record = null, isStudent = state.activeTab === "students") {
    state.editingId = record?.id ?? null;
    document.querySelector("#dialog-eyebrow").textContent = record ? "EDIT RECORD" : "NEW RECORD";
    document.querySelector("#dialog-title").textContent =
        `${record ? "Edit" : "Add"} ${isStudent ? "student" : "department"}`;
    document.querySelector("#save-record").textContent = record ? "Save changes" : "Save record";
    document.querySelector("#form-error").hidden = true;

    const fields = document.querySelector("#form-fields");
    fields.replaceChildren();
    if (isStudent) {
        fields.append(
            createInputField("Student name", "studentName", "text", record?.studentName ?? "", "Enter student name"),
            createInputField("Age", "studentAge", "number", record?.studentAge ?? "", "Enter age", { min: "1", max: "150" }),
            createDepartmentField(record?.dept?.id ?? findStudentDepartment(record?.id)?.id)
        );
    } else {
        fields.append(
            createInputField("Department name", "deptName", "text", record?.deptName ?? "", "Enter department name"),
            createInputField("Location", "location", "text", record?.location ?? "", "Enter location")
        );
    }
    recordForm.dataset.type = isStudent ? "student" : "department";
    recordDialog.showModal();
}

function createInputField(labelText, name, type, value, placeholder, attributes = {}) {
    const wrapper = document.createElement("div");
    wrapper.className = "field";
    const label = document.createElement("label");
    label.htmlFor = `field-${name}`;
    label.textContent = labelText;
    const input = document.createElement("input");
    input.id = `field-${name}`;
    input.name = name;
    input.type = type;
    input.value = value;
    input.placeholder = placeholder;
    input.required = true;
    Object.entries(attributes).forEach(([key, attributeValue]) => input.setAttribute(key, attributeValue));
    wrapper.append(label, input);
    return wrapper;
}

function createDepartmentField(selectedId) {
    const wrapper = document.createElement("div");
    wrapper.className = "field";
    const label = document.createElement("label");
    label.htmlFor = "field-departmentId";
    label.textContent = "Department";
    const select = document.createElement("select");
    select.id = "field-departmentId";
    select.name = "departmentId";
    select.required = true;
    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = "Choose a department";
    select.append(placeholder);
    state.departments.forEach((department) => {
        const option = document.createElement("option");
        option.value = department.id;
        option.textContent = department.deptName;
        option.selected = Number(selectedId) === department.id;
        select.append(option);
    });
    if (!state.departments.length) {
        placeholder.textContent = "Create a department first";
    }
    wrapper.append(label, select);
    return wrapper;
}

async function saveRecord(event) {
    event.preventDefault();
    const formError = document.querySelector("#form-error");
    formError.hidden = true;
    const formData = new FormData(recordForm);
    const isStudent = recordForm.dataset.type === "student";
    const payload = isStudent
        ? {
            studentName: String(formData.get("studentName")).trim(),
            studentAge: Number(formData.get("studentAge")),
            dept: { id: Number(formData.get("departmentId")) }
        }
        : {
            deptName: String(formData.get("deptName")).trim(),
            location: String(formData.get("location")).trim()
        };
    const path = isStudent ? studentApi : departmentApi;
    const editing = state.editingId !== null;

    try {
        await request(editing ? `${path}/${state.editingId}` : path, {
            method: editing ? "PUT" : "POST",
            body: JSON.stringify(payload)
        });
        recordDialog.close();
        if (await loadData()) {
            showNotice(`${isStudent ? "Student" : "Department"} ${editing ? "updated" : "created"} successfully.`, "success");
        }
    } catch (error) {
        formError.textContent = `Could not save record: ${error.message}`;
        formError.hidden = false;
    }
}

async function viewRecord(id, isStudent) {
    try {
        const record = await request(`${isStudent ? studentApi : departmentApi}/${id}`);
        const title = document.querySelector("#details-title");
        const content = document.querySelector("#details-content");
        title.textContent = isStudent ? record.studentName : record.deptName;
        content.replaceChildren();
        const details = isStudent
            ? [
                ["ID", record.id],
                ["Student", record.studentName],
                ["Age", record.studentAge],
                ["Department", findStudentDepartment(record.id)?.deptName || "—"]
            ]
            : [
                ["ID", record.id],
                ["Department", record.deptName],
                ["Location", record.location]
            ];
        details.forEach(([label, value]) => {
            const line = document.createElement("p");
            const key = document.createElement("strong");
            key.textContent = label;
            line.append(key, document.createTextNode(value ?? "—"));
            content.append(line);
        });
        if (!isStudent && Array.isArray(record.students)) {
            const line = document.createElement("p");
            const key = document.createElement("strong");
            key.textContent = "Students";
            line.append(key);
            if (record.students.length) {
                const list = document.createElement("ul");
                record.students.forEach((student) => {
                    const item = document.createElement("li");
                    item.textContent = `${student.studentName} (age ${student.studentAge})`;
                    list.append(item);
                });
                line.append(list);
            } else {
                line.append(document.createTextNode("No students assigned"));
            }
            content.append(line);
        }
        detailsDialog.showModal();
    } catch (error) {
        showNotice(`Could not load record: ${error.message}`, "error");
    }
}

async function deleteRecord(record, isStudent) {
    const type = isStudent ? "student" : "department";
    const extra = !isStudent && record.students?.length
        ? ` This may also remove its ${record.students.length} student record(s).`
        : "";
    if (!window.confirm(`Delete ${type} "${isStudent ? record.studentName : record.deptName}"?${extra}`)) return;

    try {
        await request(`${isStudent ? studentApi : departmentApi}/${record.id}`, { method: "DELETE" });
        if (await loadData()) {
            showNotice(`${type[0].toUpperCase()}${type.slice(1)} deleted successfully.`, "success");
        }
    } catch (error) {
        showNotice(`Could not delete ${type}: ${error.message}`, "error");
    }
}

document.querySelector("#students-tab").addEventListener("click", () => setTab("students"));
document.querySelector("#departments-tab").addEventListener("click", () => setTab("departments"));
document.querySelector("#add-record").addEventListener("click", () => openEditor());
document.querySelector("#search").addEventListener("input", (event) => {
    state.search = event.target.value;
    render();
});
recordForm.addEventListener("submit", saveRecord);
document.querySelector("#close-dialog").addEventListener("click", () => recordDialog.close());
document.querySelector("#cancel-dialog").addEventListener("click", () => recordDialog.close());
document.querySelector("#close-details").addEventListener("click", () => detailsDialog.close());

loadData();
