async function loadAttendance() {
  try {
    // Fetch overall attendance
    const overallRes = await fetch('http://127.0.0.1:8000/attendance?filter=overall');
    const overall = await overallRes.text(); // since it's just "80"
    document.getElementById('overallAttendance').textContent = `${overall}%`;

    // Fetch detailed attendance
    const detailedRes = await fetch('http://127.0.0.1:8000/attendance?filter=detailed');
    const detailed = await detailedRes.json();

    const tbody = document.getElementById('detailedAttendanceBody');
    tbody.innerHTML = '';

    detailed.forEach(item => {
      const tr = document.createElement('tr');
      tr.className = 'border-b hover:bg-gray-50';

      // Main row
      tr.innerHTML = `
        <td class="px-4 py-2">${item.Subject}</td>
        <td class="px-4 py-2">${item['Total Classes'] ?? '-'}</td>
        <td class="px-4 py-2">${item.Present ?? '-'}</td>
        <td class="px-4 py-2">${item.Absent ?? '-'}</td>
        <td class="px-4 py-2">${item.Percentage ?? '-'}</td>
        <td class="px-4 py-2 text-blue-600 cursor-pointer" data-altid="${item.altid ?? ''}">
          ${item.altid ? 'Expand' : ''}
        </td>
      `;

      tbody.appendChild(tr);

      // Click to expand row if altid exists
      if (item.altid) {
        const expandCell = tr.querySelector('td:last-child');
        expandCell.addEventListener('click', async () => {
          // Check if details row already exists
          if (tr.nextElementSibling && tr.nextElementSibling.classList.contains('details-row')) {
            tr.nextElementSibling.remove();
            return;
          }

          // Fetch subject attendance details
          const res = await fetch(`http://127.0.0.1:8000/attendance/${item.altid}`);
          const classDetails = await res.json();

          const detailsTr = document.createElement('tr');
          detailsTr.className = 'details-row bg-gray-50';
          detailsTr.innerHTML = `
            <td colspan="6" class="px-4 py-2">
              <ul class="space-y-1">
                ${classDetails.map(cls => `
                  <li class="flex justify-between border-b border-gray-200 py-1">
                    <span>${cls['Class No']}</span>
                    <span>${cls.Date}</span>
                    <span>${cls.Time}</span>
                    <span>${cls.Status}</span>
                  </li>
                `).join('')}
              </ul>
            </td>
          `;
          tr.after(detailsTr);
        });
      }
    });

  } catch (err) {
    console.error('Error loading attendance:', err);
    document.getElementById('overallAttendance').textContent = 'Error';
    document.getElementById('detailedAttendanceBody').innerHTML = `
      <tr><td colspan="6" class="text-center text-red-600 py-4">Failed to load attendance</td></tr>
    `;
  }
}

document.addEventListener('DOMContentLoaded', loadAttendance);
