/* =========================================================
   MANHAJI - PDF GENERATOR
   ========================================================= */

function generateExamPDF(exam) {
  const printWindow = window.open("", "_blank");

  if (!printWindow) {
    showToast("اسمح بفتح النوافذ المنبثقة أولاً");
    return;
  }

  const questions = Array.isArray(exam.questions) ? exam.questions : [];

  const questionsHTML = questions.map((q, index) => {
    let answerArea = "";

    if (q.type === "ضع دائرة") {
      answerArea = `
        <div class="choices">
          <span>أ) __________</span>
          <span>ب) __________</span>
          <span>ج) __________</span>
          <span>د) __________</span>
        </div>
      `;
    } else if (q.type === "صح أو خطأ") {
      answerArea = `
        <div class="tf">
          ☐ صح &nbsp;&nbsp;&nbsp;&nbsp; ☐ خطأ
        </div>
      `;
    } else {
      answerArea = `
        <div class="answer-lines">
          ________________________________<br>
          ________________________________
        </div>
      `;
    }

    return `
      <div class="question">
        <div class="question-text">
          ${index + 1}. ${escapeHTML(q.text || "")}
        </div>

        <div class="question-type">
          ${escapeHTML(q.type || "")}
        </div>

        ${answerArea}
      </div>
    `;
  }).join("");

  printWindow.document.write(`
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<title>${escapeHTML(exam.name || "امتحان منهجي")}</title>

<style>
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 35px;
  background: #fffdf5;
  color: #17251d;
  font-family: Arial, Tahoma, sans-serif;
  line-height: 1.8;
}

.paper {
  max-width: 850px;
  margin: auto;
  background: white;
  padding: 35px;
  border: 1px solid #d9dfd5;
}

.header {
  text-align: center;
  border-bottom: 3px solid #557a58;
  padding-bottom: 18px;
  margin-bottom: 25px;
}

.school {
  font-size: 18px;
  font-weight: bold;
  color: #557a58;
  margin-bottom: 8px;
}

.title {
  font-size: 27px;
  font-weight: bold;
}

.subject {
  font-size: 17px;
  margin-top: 5px;
}

.info {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  margin: 25px 0;
}

.info-box {
  border-bottom: 1px solid #777;
  padding: 7px;
  min-height: 35px;
}

.question {
  margin: 24px 0;
  padding-bottom: 18px;
  border-bottom: 1px dashed #ccd3ca;
  page-break-inside: avoid;
}

.question-text {
  font-size: 18px;
  font-weight: bold;
}

.question-type {
  font-size: 12px;
  color: #6d766e;
  margin-top: 3px;
}

.choices {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-top: 12px;
}

.tf {
  margin-top: 12px;
  font-size: 17px;
}

.answer-lines {
  margin-top: 12px;
  line-height: 2.4;
  color: #555;
}

.footer {
  margin-top: 40px;
  padding-top: 15px;
  border-top: 2px solid #557a58;
  text-align: center;
  font-size: 13px;
  color: #657067;
}

@media print {
  body {
    padding: 0;
    background: white;
  }

  .paper {
    border: none;
    max-width: none;
  }
}
</style>
</head>

<body>

<div class="paper">

  <div class="header">
    <div class="school">
      مـدارس شـعلة الـنور المجــتمـعـية
    </div>

    <div class="title">
      ${escapeHTML(exam.name || "امتحان")}
    </div>

    <div class="subject">
      المادة: ${escapeHTML(exam.subject || "شامل")}
    </div>
  </div>

  <div class="info">
    <div class="info-box">اسم الطالب: __________________________</div>
    <div class="info-box">التاريخ: __________________________</div>
    <div class="info-box">الصف: __________________________</div>
    <div class="info-box">الدرجة: __________________________</div>
  </div>

  ${questionsHTML}

  <div class="footer">
    منهجي • منصة تعليمية لتنظيم المناهج والكتب والأسئلة والامتحانات
  </div>

</div>

<script>
window.onload = function () {
  setTimeout(function () {
    window.print();
  }, 500);
};
<\/script>

</body>
</html>
  `);

  printWindow.document.close();
}


/* حماية النصوص قبل وضعها داخل HTML */
function escapeHTML(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}