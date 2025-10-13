// لتغيير اللغة
function changeLanguage(language) {
  if (language === 'ar') {
    document.documentElement.lang = 'ar';
    document.body.style.direction = 'rtl';
    document.getElementById("title").innerHTML = '<i class="fa-solid fa-calculator"></i> حاسبة الضريبة والضمان الاجتماعي';
    document.getElementById("salaryLabel").textContent = "الراتب الشهري (دينار):";
    document.getElementById("maritalStatusLabel").textContent = "الحالة الاجتماعية:";
    document.getElementById("childrenLabel").textContent = "عدد الأولاد:";
    document.getElementById("yearLabel").textContent = "تاريخ التسجيل في الضمان الاجتماعي :";
    document.getElementById("annualSalaryLabel").textContent = "الراتب السنوي:";
    document.getElementById("exemptionsLabel").textContent = "الإعفاء:";
    document.getElementById("taxableIncomeLabel").textContent = "الراتب الخاضع للضريبة:";
    document.getElementById("annualTaxLabel").textContent = "مجموع الضريبة السنوية:";
    document.getElementById("monthlyTaxLabel").textContent = "الضريبة الشهرية:";
    document.getElementById("employeeSocialSecurityLabel").textContent = "مجموع الضمان الاجتماعي للموظف:";
    document.getElementById("companySocialSecurityLabel").textContent = "مجموع الضمان الاجتماعي للشركة:";
    document.getElementById("childrenWarning").textContent = "الحد الأقصى للإعفاء هو 3 أولاد (3000 دينار).";
  } else {
    document.documentElement.lang = 'en';
    document.body.style.direction = 'ltr';
    document.getElementById("title").innerHTML = '<i class="fa-solid fa-calculator"></i> Tax and Social Security Calculator';
    document.getElementById("salaryLabel").textContent = "Monthly Salary (JOD):";
    document.getElementById("maritalStatusLabel").textContent = "Marital Status:";
    document.getElementById("childrenLabel").textContent = "Number of Children:";
    document.getElementById("yearLabel").textContent = "Year of employment in social security:";
    document.getElementById("annualSalaryLabel").textContent = "Annual Salary:";
    document.getElementById("exemptionsLabel").textContent = "Exemption:";
    document.getElementById("taxableIncomeLabel").textContent = "Taxable Income:";
    document.getElementById("annualTaxLabel").textContent = "Total Annual Tax:";
    document.getElementById("monthlyTaxLabel").textContent = "Monthly Tax:";
    document.getElementById("employeeSocialSecurityLabel").textContent = "Employee Social Security Total:";
    document.getElementById("companySocialSecurityLabel").textContent = "Company Social Security Total:";
    document.getElementById("childrenWarning").textContent = "Maximum exemption is for 3 children (3000 JOD).";
  }
}

// لتبديل الحقل الخاص بالأطفال بناءً على الحالة الاجتماعية
function toggleChildrenField() {
  const maritalStatus = document.getElementById("maritalStatus").value;
  const childrenContainer = document.getElementById("childrenContainer");
  childrenContainer.style.display = maritalStatus === "single" ? "none" : "block";
}

// لحساب الضريبة والضمان الاجتماعي
function calculate() {
  const salary = parseFloat(document.getElementById("salary").value);
  const maritalStatus = document.getElementById("maritalStatus").value;
  const numChildren = parseInt(document.getElementById("children").value) || 0;
  const yearOfEmployment = document.getElementById("year").value;

  if (isNaN(salary) || salary <= 0 || !maritalStatus || !yearOfEmployment) {
    alert("Please fill all fields correctly.");
    return;
  }

  let annualSalary = salary * 12;
  let exemptions = maritalStatus === "married" ? 18000 : 9000;

  if (numChildren > 3) {
    document.getElementById("childrenWarning").style.display = "block";
    exemptions += 3000;
  } else {
    document.getElementById("childrenWarning").style.display = "none";
    if (numChildren > 0) exemptions += numChildren * 1000;
  }

  let taxableIncome = annualSalary - exemptions;
  taxableIncome = taxableIncome > 0 ? taxableIncome : 0;

  let tax = 0;
  if (taxableIncome > 20000) {
    tax += (taxableIncome - 20000) * 0.25;
    taxableIncome = 20000;
  }
  if (taxableIncome > 15000) {
    tax += (taxableIncome - 15000) * 0.20;
    taxableIncome = 15000;
  }
  if (taxableIncome > 10000) {
    tax += (taxableIncome - 10000) * 0.15;
    taxableIncome = 10000;
  }
  if (taxableIncome > 5000) {
    tax += (taxableIncome - 5000) * 0.10;
    taxableIncome = 5000;
  }
  if (taxableIncome > 0) {
    tax += taxableIncome * 0.05;
  }

  let monthlyTax = tax / 12;

  let maxSalaryForSS;
  if (yearOfEmployment === 'retired') {
    maxSalaryForSS = 0;
  } else if (yearOfEmployment === 'before2009') {
    maxSalaryForSS = 5000;
  } else {
    maxSalaryForSS = 3612;
  }

  let adjustedSalary = salary > maxSalaryForSS ? maxSalaryForSS : salary;

  let employeeSocialSecurity = adjustedSalary * 0.075;
  let companySocialSecurity = adjustedSalary * 0.1425;

  document.getElementById("result").style.display = "block";
  document.getElementById("annualSalary").textContent = annualSalary.toFixed(2);
  document.getElementById("exemptions").textContent = exemptions;
  document.getElementById("taxableIncome").textContent = (annualSalary - exemptions).toFixed(2);
  document.getElementById("annualTax").textContent = tax.toFixed(2);
  document.getElementById("monthlyTax").textContent = monthlyTax.toFixed(2);
  document.getElementById("employeeSocialSecurity").textContent = employeeSocialSecurity.toFixed(2);
  document.getElementById("companySocialSecurity").textContent = companySocialSecurity.toFixed(2);
}

// لتبديل الوضع الداكن والفاتح
let isDarkMode = false;

function toggleTheme() {
  isDarkMode = !isDarkMode;
  if (isDarkMode) {
    document.body.classList.add('dark-mode');
    document.getElementById('themeToggle').innerHTML = '<span class="material-icons">brightness_7</span> Light Mode';
  } else {
    document.body.classList.remove('dark-mode');
    document.getElementById('themeToggle').innerHTML = '<span class="material-icons">brightness_4</span> Dark Mode';
  }
}
