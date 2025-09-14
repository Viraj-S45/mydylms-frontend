let currentDocs = []; // store docs for filtering

async function loadSemesters() {
  try {
    const res = await fetch('http://127.0.0.1:8000/sem'); 
    const data = await res.json();

    const semesterSelect = document.getElementById('semesterSelect');
    const subjectSelect = document.getElementById('subjectSelect');
    const documentsContainer = document.getElementById('documentsContainer');
    const docFilter = document.getElementById('docFilter');

    semesterSelect.innerHTML = '';
    subjectSelect.innerHTML = '<option selected disabled>Select a semester first</option>';
    documentsContainer.innerHTML = '<div class="text-slate-500 text-center py-3">Select a subject to load documents</div>';
    docFilter.innerHTML = '<option value="all" selected>All</option>';

    // Populate semesters
    data.forEach((semObj, index) => {
      const option = document.createElement('option');
      option.value = index + 1; 
      option.textContent = semObj.semester;
      if (index === data.length - 1) option.selected = true; // last semester default
      semesterSelect.appendChild(option);
    });

    if (semesterSelect.value) loadSubjects(semesterSelect.value);

    semesterSelect.addEventListener('change', (e) => {
      loadSubjects(e.target.value);
    });

  } catch (err) {
    console.error('Error fetching semesters:', err);
  }
}

async function loadSubjects(sem_no) {
  const subjectSelect = document.getElementById('subjectSelect');
  const documentsContainer = document.getElementById('documentsContainer');
  const docFilter = document.getElementById('docFilter');

  subjectSelect.innerHTML = '<option selected disabled>Loading subjects...</option>';
  documentsContainer.innerHTML = '<div class="text-slate-500 text-center py-3">Select a subject to load documents</div>';
  docFilter.innerHTML = '<option value="all" selected>All</option>';

  try {
    const res = await fetch(`http://127.0.0.1:8000/sem/${sem_no}`);
    const subjects = await res.json();

    if (!subjects.length) {
      subjectSelect.innerHTML = '<option disabled>No subjects found</option>';
      return;
    }

    subjectSelect.innerHTML = '';
    subjects.forEach((sub, index) => {
      const option = document.createElement('option');
      option.value = sub.id;
      option.textContent = sub.name;
      if (index === 0) option.selected = true; 
      subjectSelect.appendChild(option);
    });

    loadDocuments(sem_no, subjectSelect.value);

    subjectSelect.addEventListener('change', (e) => {
      loadDocuments(sem_no, e.target.value);
    });

  } catch (err) {
    console.error('Error fetching subjects:', err);
    subjectSelect.innerHTML = '<option disabled>Error loading subjects</option>';
  }
}

async function loadDocuments(sem_no, sub_id) {
  const container = document.getElementById('documentsContainer');
  const docFilter = document.getElementById('docFilter');

  container.innerHTML = '<div class="text-slate-500 text-center py-3">Loading documents...</div>';
  docFilter.innerHTML = '<option value="all" selected>All</option>';

  try {
    const res = await fetch(`http://127.0.0.1:8000/sem/${sem_no}/sub/${sub_id}`);
    const docs = await res.json();
    currentDocs = docs;

    if (!docs.length) {
      container.innerHTML = '<div class="text-slate-500 text-center py-3">No documents found</div>';
      return;
    }

    // Populate filter options
    const modTypes = [...new Set(docs.map(d => d.mod_type))];
    modTypes.forEach(type => {
      const option = document.createElement('option');
      option.value = type;
      option.textContent = type.charAt(0).toUpperCase() + type.slice(1);
      docFilter.appendChild(option);
    });

    // Initial render
    renderDocuments(docs, sem_no, sub_id);

    // Filter change
    docFilter.addEventListener('change', () => {
      const selectedType = docFilter.value;
      const filteredDocs = selectedType === 'all' ? docs : docs.filter(d => d.mod_type === selectedType);
      renderDocuments(filteredDocs, sem_no, sub_id);
    });

  } catch (err) {
    console.error('Error fetching documents:', err);
    container.innerHTML = '<div class="text-slate-500 text-center py-3">Error loading documents</div>';
  }
}

function renderDocuments(docs, sem_no, sub_id) {
  const container = document.getElementById('documentsContainer');
  container.innerHTML = '';

  docs.forEach(doc => {
    const div = document.createElement('div');
    div.className = 'flex items-center justify-between py-3 last:pb-0';

    const showDownload = !['url', 'quiz', 'assign', 'foroum'].includes(doc.mod_type); // conditional download

    div.innerHTML = `
      <div>
        <h6 class="text-slate-800 font-semibold">${doc.name}</h6>
        <span class="inline-block bg-gray-200 text-xs text-slate-700 px-2 py-0.5 rounded mt-1">${doc.mod_type}</span>
      </div>
      <div class="flex gap-2">
      ${showDownload ? `<a href="http://127.0.0.1:8000/sem/${sem_no}/sub/${sub_id}/doc/${doc.id}/download" 
      class="px-3 py-1 bg-gray-800 text-white text-sm rounded hover:bg-gray-700">Download</a>` : ''}
      <a href="http://127.0.0.1:8000/sem/${sem_no}/sub/${sub_id}/doc/${doc.id}/view" target="_blank" 
         class="px-3 py-1 bg-red-900 text-white text-sm rounded hover:bg-red-700">View</a>
      </div>
    `;

    container.appendChild(div);
  });
}

document.addEventListener('DOMContentLoaded', loadSemesters);



async function loadDocuments(sem_no, sub_id) {
  const container = document.getElementById('documentsContainer');
  const docFilter = document.getElementById('docFilter');

  container.innerHTML = '<div class="text-slate-500 text-center py-3">Loading documents...</div>';
  docFilter.innerHTML = '<option value="all" selected>All</option>';

  try {
    const res = await fetch(`http://127.0.0.1:8000/sem/${sem_no}/sub/${sub_id}`);
    const docs = await res.json();
    currentDocs = docs;

    if (!docs.length) {
      container.innerHTML = '<div class="text-slate-500 text-center py-3">No documents found</div>';
      return;
    }

    // Populate filter
    const modTypes = [...new Set(docs.map(d => d.mod_type))];
    modTypes.forEach(type => {
      const option = document.createElement('option');
      option.value = type;
      option.textContent = type.charAt(0).toUpperCase() + type.slice(1);
      docFilter.appendChild(option);
    });

    // Initial render
    renderDocuments(docs, sem_no, sub_id);

    // Filter change
    docFilter.addEventListener('change', () => {
      const selectedType = docFilter.value;
      const filteredDocs = selectedType === 'all' ? docs : docs.filter(d => d.mod_type === selectedType);
      renderDocuments(filteredDocs, sem_no, sub_id);
    });




  } catch (err) {
    console.error('Error fetching documents:', err);
    container.innerHTML = '<div class="text-slate-500 text-center py-3">Error loading documents</div>';
  }
}
