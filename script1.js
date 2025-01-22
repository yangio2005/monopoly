// Use the following to include this JavaScript file 
// <script src="script1.js"></script>
 const API_KEY = 'AIzaSyBNlOx9WnM65kQMJz1RsvNMiYEZV1GI3Tw'; // Thay thế bằng API Key của bạn
        const SPREADSHEET_ID = '1wOjdf5Kt2vwbs6Jsf873i96WvQWv9vocqwn1Cswrjus'; // Thay thế bằng ID của Google Sheets
        const ranges = ['data!A1:E1507', 'Điểm trừ!A1:E977'];

        async function search() {
            const query = document.getElementById("searchInput").value.trim();
            if (!query) {
                alert("Vui lòng nhập MSSV hoặc tên sinh viên!");
                return;
            }

            document.getElementById("results").innerHTML = 
                '<div class="text-center"><div class="spinner-border text-primary" role="status"></div></div>';

            const data = await fetchStudentData();
            if (data) {
                const results = processStudentData(data, query);
                displayResults(results);
            }
        }

        async function fetchStudentData() {
            const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values:batchGet?ranges=${ranges.join('&ranges=')}&key=${API_KEY}`;
            try {
                const response = await fetch(url);
                if (!response.ok) throw new Error("Không thể lấy dữ liệu từ Google Sheets");
                
                const result = await response.json();
                return mergeSheetData(result.valueRanges);
            } catch (error) {
                document.getElementById("results").innerHTML = `
                    <div class="alert alert-danger text-center">Lỗi khi tải dữ liệu: ${error.message}</div>`;
                return null;
            }
        }

        function mergeSheetData(valueRanges) {
            const [dataSheet, deductionSheet] = valueRanges;
            const dataRecords = dataSheet.values || [];
            const deductionRecords = deductionSheet.values || [];
            return { dataRecords, deductionRecords };
        }

        function processStudentData({ dataRecords, deductionRecords }, query) {
            let results = {
                bonusPoints: [],
                deductionPoints: [],
                totalBonus: 0,
                totalDeduction: 0,
                studentInfo: {}
            };

            for (let i = 1; i < dataRecords.length; i++) {
                const [name, mssv, evidence, bonusPoint, activity] = dataRecords[i];
                if (String(name).includes(query) || String(mssv) === query) {
                    results.bonusPoints.push({ activity, bonusPoint });
                    results.totalBonus += Number(bonusPoint) || 0;

                    if (!results.studentInfo.name) {
                        results.studentInfo.name = name;
                        results.studentInfo.mssv = mssv;
                    }
                }
            }

            for (let i = 1; i < deductionRecords.length; i++) {
                const [_, name, mssv, deductionPoint, activity] = deductionRecords[i];
                if (String(name).includes(query) || String(mssv) === query) {
                    results.deductionPoints.push({ activity, deductionPoint: Number(deductionPoint) || 0 });
                    results.totalDeduction += Number(deductionPoint) || 0;
                }
            }

            results.officialScore = results.totalBonus - results.totalDeduction;
            return results;
        }

        function displayResults(results) {
            const resultsDiv = document.getElementById("results");
            if (!results.studentInfo.name) {
                resultsDiv.innerHTML = `<div class="alert alert-warning text-center">Không tìm thấy thông tin sinh viên</div>`;
                return;
            }

            let html = `<div class="result-card">`;
            html += `<div class="card"><div class="card-body">
                        <h5 class="card-title">🎓 Thông tin sinh viên</h5>
                        <p><strong>Họ và tên:</strong> ${results.studentInfo.name}</p>
                        <p><strong>MSSV:</strong> ${results.studentInfo.mssv}</p>
                    </div></div>`;

            html += `<div class="point-section bonus-points">
                        <h5>📈 Điểm Cộng</h5>`;
            results.bonusPoints.forEach(item => {
                html += `<div class="activity-item">
                            <span>${item.activity}</span>
                            <span class="badge badge-success">+${item.bonusPoint}</span>
                         </div>`;
            });
            html += `<p class="text-right"><strong>Tổng điểm cộng: <span class="badge badge-success">+${results.totalBonus}</span></strong></p></div>`;

            html += `<div class="point-section deduction-points">
                        <h5>📉 Điểm Trừ</h5>`;
            results.deductionPoints.forEach(item => {
                html += `<div class="activity-item">
                            <span>${item.activity}</span>
                            <span class="badge badge-danger">-${item.deductionPoint}</span>
                         </div>`;
            });
            html += `<p class="text-right"><strong>Tổng điểm trừ: <span class="badge badge-danger">-${results.totalDeduction}</span></strong></p></div>`;

            html += `<div class="total-score">
                        <strong>Điểm Chính Thức: ${results.officialScore}</strong>
                    </div></div>`;
                    
            resultsDiv.innerHTML = html;
        }
        const notificationRange = 'thongbao!A3:B100'; // Phạm vi dữ liệu thông báo
/*funtion Thông báo*/
  async function showNotifications() {
    document.getElementById("notificationContent").innerHTML = '<div class="text-center"><div class="spinner-border text-primary" role="status"></div></div>';
    $('#notificationModal').modal('show');
    
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${notificationRange}?key=${API_KEY}`;
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Không thể tải thông báo");

        const result = await response.json();
        const notifications = result.values || [];
        displayNotifications(notifications);
    } catch (error) {
        document.getElementById("notificationContent").innerHTML = `<div class="alert alert-danger text-center">Lỗi khi tải thông báo: ${error.message}</div>`;
    }
}

  function displayNotifications(notifications) {
    if (notifications.length === 0) {
        document.getElementById("notificationContent").innerHTML = `<div class="text-center text-muted">Không có thông báo nào</div>`;
        return;
    }

    // Đảo ngược mảng để hiển thị thông báo mới nhất ở dưới cùng
    notifications.reverse();

    let html = '<ul class="list-group">';
    notifications.forEach(([timestamp, content]) => {
        html += `<li class="list-group-item">
                    <strong>${timestamp}</strong>: ${content}
                 </li>`;
    });
    html += '</ul>';
    document.getElementById("notificationContent").innerHTML = html;
}


//Thông báo//

function toggleReportFields() {
    const reportType = document.getElementById('reportType').value;
    const personalInfoFields = document.getElementById('personalInfoFields');
    if (reportType === 'identified') {
        personalInfoFields.style.display = 'block';
    } else {
        personalInfoFields.style.display = 'none';
    }
}

function submitReport() {
    const reportType = document.getElementById('reportType').value;
    const fullName = document.getElementById('fullName').value.trim();
    const studentId = document.getElementById('studentId').value.trim();
    const reportContent = document.getElementById('reportContent').value.trim();

    if (reportType === 'identified' && (!fullName || !studentId)) {
        alert('Vui lòng nhập đầy đủ họ và tên, MSSV.');
        return;
    }

    if (!reportContent) {
        alert('Vui lòng nhập nội dung báo cáo.');
        return;
    }

    // Xử lý gửi báo cáo (ví dụ: gửi đến server hoặc lưu trữ)
    console.log('Báo cáo đã được gửi:', { reportType, fullName, studentId, reportContent });

    // Đóng modal sau khi gửi báo cáo
    $('#reportModal').modal('hide');

    // Gửi dữ liệu đến Webhook
    const webhookUrl = 'https://chat.googleapis.com/v1/spaces/AAAAlcxRv3U/messages?key=AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI&token=tLfhDrmn72TLNj-oyorDj57sy7MXNeAPGd9HN-3VAOU';
    const payload = {
        text: `Báo cáo mới:\nLoại báo cáo: ${reportType}\nHọ và tên: ${fullName}\nMSSV: ${studentId}\nNội dung báo cáo: ${reportContent}`
    };

    fetch(webhookUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Đã gửi báo cáo đến Webhook:', data);
        alert('Báo cáo đã được gửi thành công!');
    })
    .catch(error => {
        console.error('Lỗi khi gửi báo cáo đến Webhook:', error);
        alert('Đã xảy ra lỗi khi gửi báo cáo. Vui lòng thử lại!');
    });

    // Hiển thị thông báo thành công
    const successMessage = document.getElementById('successMessage');
    successMessage.style.display = 'block';

    // Ẩn thông báo sau 5 giây
    setTimeout(() => {
        successMessage.style.display = 'none';
    }, 5000);
}
