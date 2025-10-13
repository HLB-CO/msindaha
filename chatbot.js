document.addEventListener("DOMContentLoaded", () => {
  const chatbot = document.getElementById('chatbot');
  const toggleBtn = document.getElementById('chatbotToggle');
  const content = document.getElementById('chatbotContent');
  const backBtn = document.getElementById('backButton');
  const fullscreenToggle = document.getElementById('fullscreenToggle');

  let historyStack = [];
  let optionSelected = false;
function checkCountryInsideBot() {
  const country = document.getElementById("country").value;
  const comingSoon = document.getElementById("comingSoonMessage");
  const calcFields = document.getElementById("calculatorFields");

  if (country !== "Jordan") {
    comingSoon.style.display = "block";
    calcFields.style.display = "none";
  } else {
    comingSoon.style.display = "none";
    calcFields.style.display = "block";
  }
}
  // فتح/إغلاق الشات بوت
// === فتح/إغلاق الشات بوت مع LocalStorage ===
toggleBtn.addEventListener('click', () => {
  if (chatbot.style.display === "none" || chatbot.style.display === "") {
    // فتح الشات
    chatbot.style.display = "flex";
    content.innerHTML = "";
    historyStack = [];
    optionSelected = false;
    botMessage("How can I help you?", showMainOptions);
    setTimeout(() => { chatbot.classList.add("show"); }, 10);

    // حفظ الحالة مفتوحة
    localStorage.setItem("chatbotState", "open");

  } else {
    // إغلاق الشات
    chatbot.style.display = "none";
    chatbot.classList.remove("show");
    content.innerHTML = "";
    historyStack = [];
    optionSelected = false;

    // حفظ الحالة مغلقة
    localStorage.setItem("chatbotState", "closed");
  }
});

backBtn.addEventListener('click', () => goBack());

// === عند تحميل الصفحة → استرجاع الحالة من LocalStorage ===
window.addEventListener("load", () => {
  const savedState = localStorage.getItem("chatbotState");

  if (savedState === "open") {
    // يفتح البوت مباشرة
    chatbot.style.display = "flex";
    chatbot.classList.add("show");

    // أول رسالة تظهر إذا كان المحتوى فاضي
    if (content.innerHTML.trim() === "") {
      const bubble = document.createElement('div');
      bubble.className = 'msg bot-msg tilt';
      content.appendChild(bubble);
      scrollToBottom();
    }
  } else {
    // يظل مقفول (الوضع الافتراضي)
    chatbot.style.display = "none";
    chatbot.classList.remove("show");
    localStorage.setItem("chatbotState", "closed");
  }
});


  fullscreenToggle.addEventListener("click", () => {
    chatbot.classList.toggle("fullscreen");
    const icon = fullscreenToggle.querySelector('i');
    if (chatbot.classList.contains("fullscreen")) {
      icon.classList.remove("fa-expand");
      icon.classList.add("fa-compress");
    } else {
      icon.classList.remove("fa-compress");
      icon.classList.add("fa-expand");
    }
  });

function botMessage(text, callback, link = null){
  const bubble = document.createElement('div');
  bubble.className = 'msg bot-msg relative';
  bubble.innerHTML = '<span class="typing-text"></span><span class="cursor">|</span>';
  content.appendChild(bubble);
  scrollToBottom();

  const typingSpan = bubble.querySelector('.typing-text');
  const cursor = bubble.querySelector('.cursor');
  let i = 0, speed = 15;

  function type(){
    if(i < text.length){
      typingSpan.textContent += text.charAt(i);
      i++;
      setTimeout(type, speed);
    } else {
      cursor.remove();

      // إذا فيه رابط → ضيف زر More Details
      if(link){
        const btn = document.createElement("button");
        btn.innerText = "More Details";
        btn.className = "mt-2 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded-lg shadow transition";
        btn.onclick = ()=>{ window.open(link, "_blank"); };
        bubble.appendChild(document.createElement("br"));
        bubble.appendChild(btn);
      }

      if(callback) setTimeout(callback, 400);
    }
  }
  type();
}


  function userMessage(text){
    const bubble = document.createElement('div');
    bubble.className = 'msg user-msg';
    bubble.textContent = text;
    content.appendChild(bubble);
    scrollToBottom();
  }

  function showMainOptions(){
    const box = document.createElement('div');
    box.className = 'flex flex-col gap-2 mt-3';
    box.id = 'options';
    content.appendChild(box);

    const mainOptions = [
      {value:"services", label:'<i class="fas fa-briefcase mr-2"></i> Services', classes:"bg-indigo-100 hover:bg-indigo-200 text-indigo-800"},
      {value:"about", label:'<i class="fas fa-info-circle mr-2"></i> About Us', classes:"bg-green-100 hover:bg-green-200 text-green-800"},
      {value:"contact", label:'<i class="fas fa-envelope mr-2"></i> Contact Us', classes:"bg-gray-100 hover:bg-gray-200 text-gray-700"},
      {value:"calculator", label:'<i class="fas fa-calculator mr-2"></i> Calculator', classes:"bg-purple-100 hover:bg-purple-200 text-purple-800"}
    ];

    let i = 0;
    function addNext(){
      if(i < mainOptions.length){
        const opt = mainOptions[i];
        const btn = document.createElement('button');
        btn.dataset.opt = opt.value;
        btn.className = `px-4 py-2 rounded-lg text-left transition-all duration-500 opacity-0 translate-y-2 ${opt.classes}`;
        btn.innerHTML = opt.label;
        box.appendChild(btn);
        scrollToBottom();
        setTimeout(()=>{ btn.classList.remove('opacity-0','translate-y-2'); }, 50);
        i++;
        setTimeout(addNext, 250);
      } else {
        addListeners();
      }
    }
    addNext();
  }

  function addListeners(){
    document.querySelectorAll('#options button').forEach(btn=>{
      btn.onclick=()=>{
        if(optionSelected) return;
        optionSelected=true;
        playPopSound();
        const val=btn.dataset.opt;
        userMessage(btn.innerText.trim());
        document.getElementById('options').remove();
        openSection(val);
      };
    });
  }

function openSection(val){
  backBtn.classList.remove('hidden');
  switch(val){
    case 'services':
      botMessage("Please choose a service:", ()=>{
        const box = document.createElement('div');
        box.id = 'options';
        box.className = 'flex flex-col gap-2 mt-2';
        content.appendChild(box);
        scrollToBottom();

        const services = [
          {value:"peo", label:"PEO"},
          {value:"payroll", label:"Payroll"},
          {value:"hr", label:"Human Resources"},
          {value:"general", label:"General"},
          {value:"accounting", label:"Accounting"},
          {value:"audit", label:"Audit"},
          {value:"tax", label:"Tax & Business Support"}
        ];

        let i = 0;
        function addNext(){
          if(i < services.length){
            const s = services[i];
            const btn = document.createElement('button');
            btn.dataset.opt = s.value;
            btn.className = "bg-blue-100 hover:bg-blue-200 px-3 py-2 rounded text-blue-800 text-left transition-all duration-500 opacity-0 translate-y-2";
            btn.textContent = s.label;
            box.appendChild(btn);
            scrollToBottom();
            setTimeout(()=>{ btn.classList.remove('opacity-0','translate-y-2'); }, 50);
            i++;
            setTimeout(addNext, 250);
          } else { addListeners(); }
        }
        addNext();
      });
      break;

    case 'about':
      botMessage("We are Msindaha, a professional firm specializing in Payroll, HR, Accounting, Audit, and Business Support services.", ()=>{
        const html=`<div class="mt-2 text-sm space-y-1">
          <p><b>Our Vision:</b> To be the trusted partner for businesses seeking excellence in HR and financial services.</p>
          <p><b>Our Mission:</b> Delivering innovative, accurate, and client-focused solutions that empower business growth.</p>
          <p><b>Values:</b> Integrity, Commitment, Innovation, and Excellence.</p>
        </div>`;
        content.insertAdjacentHTML('beforeend', html);
        scrollToBottom();
      });
      break;

    case 'contact':
      botMessage("Here are our contact details:",()=>{
        const html=`<div class="mt-2 text-sm space-y-1">
          <p><b>Address:</b> 9, Ahmad Taymour St, Shmeisani, Amman, Jordan</p>
          <p><b>Phone 1:</b> +(962) 775061919</p>
          <p><b>Phone 2:</b> +(962) 797174704</p>
          <p><b>Amman Office:</b> 065539346</p>
          <p><b>Email:</b> info@msindaha.com</p>
          <p><b>Working Times:</b> Sunday to Thursday 09:00 AM to 05:00 PM</p>
        </div>`;
        content.insertAdjacentHTML('beforeend',html);
        scrollToBottom();
      });
      break;

case 'calculator':
  botMessage("Welcome to the Tax & Social Security Calculator", () => {
    const html = `
      <div id="calculator" class="mt-4 p-4 rounded-2xl shadow bg-gradient-to-br from-white to-gray-50 space-y-4 text-sm">

        <!-- اختيار الدولة -->
        <div class="space-y-1">
          <label for="country" class="block text-gray-600 font-medium">Country:</label>
          <select id="country" onchange="checkCountryInsideBot()"
                  class="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none transition">
            <option value="Jordan">Jordan</option>
            <option value="Lebanon">Lebanon</option>
            <option value="Iraq">Iraq</option>
            <option value="Bahrain">Bahrain</option>
            <option value="Djibouti">Djibouti</option>
            <option value="Qatar">Qatar</option>
            <option value="Oman">Oman</option>
            <option value="Syria">Syria</option>
            <option value="Tunisia">Tunisia</option>
            <option value="Palestine">Palestine</option>
            <option value="Algeria">Algeria</option>
            <option value="Sudan">Sudan</option>
            <option value="Somalia">Somalia</option>
            <option value="Kuwait">Kuwait</option>
            <option value="UAE">UAE</option>
            <option value="United Kingdom">United Kingdom</option>
          </select>
        </div>

        <!-- رسالة "قريباً" -->
        <div id="comingSoonMessage" class="text-red-600 mt-2" style="display:none;">
          Tax calculator is available only for Jordan. Coming soon for other countries.
        </div>

        <!-- حقول الحاسبة -->
        <div id="calculatorFields" class="space-y-2 mt-2">

          <div class="space-y-1">
            <label for="salary" class="block text-gray-600 font-medium">Monthly Salary</label>
            <input id="salary" type="number" 
                   class="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none transition">
          </div>

          <div class="space-y-1">
            <label for="status" class="block text-gray-600 font-medium">Marital Status</label>
            <select id="status" onchange="toggleChildrenField()"
                    class="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none transition">
              <option value="single" selected>Single</option>
              <option value="married">Married</option>
            </select>
          </div>

          <div id="childrenField" class="space-y-1">
            <label for="children" class="block text-gray-600 font-medium">Children</label>
            <input id="children" type="number" min="0"
                   class="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none transition">
          </div>

          <div class="space-y-1">
            <label for="registration" class="block text-gray-600 font-medium">Social Security Registration</label>
            <select id="registration"
                    class="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none transition">
              <option value="before2009">Before 2009</option>
              <option value="after2009">2009 & After</option>
              <option value="retired">Retired</option>
            </select>
          </div>

          <div class="flex gap-2 pt-2">
            <button onclick="calculate()" 
                    class="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-xl shadow transition">
              Calculate
            </button>
            <button onclick="changeLanguage()" 
                    class="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold px-4 py-2 rounded-xl transition">
              Change Language
            </button>
          </div>

          <div id="results" class="hidden mt-4 p-3 rounded-xl border bg-white shadow-inner text-sm space-y-1"></div>

        </div>
      </div>`;
    content.insertAdjacentHTML('beforeend', html);
    scrollToBottom();
    toggleChildrenField(); // يخفي الأولاد إذا Single
    checkCountryInsideBot(); // يتحقق من الدولة مباشرة
  });
  break;


    case 'peo':
      botMessage("We serve as the employer for tax purposes...",()=>{},"peo.html");
      break;

    case 'payroll':
      botMessage("The Payroll System includes all functions that are necessary to manage that process.",()=>{},"payroll.html");
      break;

    case 'hr':
      botMessage("The Human Resource System includes all functions that are necessary to manage that process.",()=>{},"hr.html");
      break;

    case 'general':
      botMessage("General Services information.",()=>{},"https://www.hlbjordan.com/services/general/");
      break;

    case 'accounting':
      botMessage("Accounting Services information.",()=>{},"https://www.hlbjordan.com/services/Accounting/");
      break;

    case 'audit':
      botMessage("Audit Services information.",()=>{},"https://www.hlbjordan.com/services/audit/");
      break;

    case 'tax':
      botMessage("Tax Services information.",()=>{},"https://www.hlbjordan.com/services/tax/");
      break;
  }
  historyStack.push(content.innerHTML);
  optionSelected=false;
}


  function simulateLink(){
    const loader=`<div class="typing-dots my-2"><span></span><span></span><span></span></div>`;
    content.insertAdjacentHTML('beforeend',loader);
    scrollToBottom();
    setTimeout(()=>{ window.open('#','_blank'); },1000);
  }

  function goBack(){
    content.innerHTML = "";
    historyStack = [];
    optionSelected = false;
    backBtn.classList.add('hidden');
    botMessage("How can I help you?", showMainOptions);
  }

  function scrollToBottom(){ content.scrollTop=content.scrollHeight; }

  function playPopSound(){
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(220, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.1, ctx.currentTime + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.25);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.25);
  }

  // أول رسالة عند تحميل الصفحة
  setTimeout(() => {
    chatbot.classList.add("show");
    const bubble = document.createElement('div');
    bubble.className = 'msg bot-msg tilt';
    bubble.textContent = "How can I help you?";
    content.appendChild(bubble);
    scrollToBottom();
    setTimeout(showMainOptions, 800);
  }, 500);
});


// ========== دوال الحاسبة ==========
function changeLanguage() {
  const calc = document.getElementById("calculator");

  if (calc.classList.contains("lang-ar")) {
    // التحويل للإنجليزية
    calc.classList.remove("lang-ar");
    calc.classList.add("lang-en");
    calc.setAttribute("dir", "ltr");

    // تغيير النصوص للإنجليزية
    document.querySelector("h2").textContent = "Income Tax Calculator";
    document.querySelector("label[for='salary']").textContent = "Monthly Salary:";
    document.querySelector("label[for='status']").textContent = "Marital Status:";
    document.querySelector("label[for='children']").textContent = "Number of Children:";
    document.querySelector("label[for='social']").textContent = "Social Security Registration:";
    document.querySelector("#calcBtn").textContent = "Calculate";
    document.querySelector("#langBtn").textContent = "عربي";

    document.querySelector("#status option[value='single']").textContent = "Single";
    document.querySelector("#status option[value='married']").textContent = "Married";
    document.querySelector("#social option[value='before2009']").textContent = "Before 2009";
    document.querySelector("#social option[value='after2009']").textContent = "After 2009";
    document.querySelector("#social option[value='retired']").textContent = "Retired";

  } else {
    // التحويل للعربية
    calc.classList.remove("lang-en");
    calc.classList.add("lang-ar");
    calc.setAttribute("dir", "rtl");

    // تغيير النصوص للعربية
    document.querySelector("h2").textContent = "حاسبة ضريبة الدخل";
    document.querySelector("label[for='salary']").textContent = "الراتب الشهري:";
    document.querySelector("label[for='status']").textContent = "الحالة الاجتماعية:";
    document.querySelector("label[for='children']").textContent = "عدد الأولاد:";
    document.querySelector("label[for='social']").textContent = "التسجيل بالضمان:";
    document.querySelector("#calcBtn").textContent = "احسب";
    document.querySelector("#langBtn").textContent = "English";

    document.querySelector("#status option[value='single']").textContent = "أعزب";
    document.querySelector("#status option[value='married']").textContent = "متزوج";
    document.querySelector("#social option[value='before2009']").textContent = "قبل 2009";
    document.querySelector("#social option[value='after2009']").textContent = "بعد 2009";
    document.querySelector("#social option[value='retired']").textContent = "متقاعد";
  }
}


function toggleChildrenField() {
  const status = document.getElementById("status").value;
  const childrenField = document.getElementById("childrenField");
  if (status === "single") {
    childrenField.style.display = "none";
  } else {
    childrenField.style.display = "block";
  }
}

function calculate() {
  const salary = parseFloat(document.getElementById("salary").value);
  const status = document.getElementById("status").value;
  const children = parseInt(document.getElementById("children").value) || 0;
  const registration = document.getElementById("registration").value;
  const resultsDiv = document.getElementById("results");

  if (isNaN(salary) || !status || !registration) {
    alert("Please fill all required fields correctly.");
    return;
  }

  const annualSalary = salary * 12;
  let exemptions = status === "single" ? 9000 : 18000;

  if (children > 0) {
    if (children > 3) {
      alert("Max children exemption is for 3 children.");
      exemptions += 3000;
    } else {
      exemptions += children * 1000;
    }
  }

  const taxableBase = Math.max(annualSalary - exemptions, 0);

  // الشرائح
  let tax = 0;
  let taxableIncome = taxableBase;
  if (taxableIncome > 20000) { tax += (taxableIncome - 20000) * 0.25; taxableIncome = 20000; }
  if (taxableIncome > 15000) { tax += (taxableIncome - 15000) * 0.20; taxableIncome = 15000; }
  if (taxableIncome > 10000) { tax += (taxableIncome - 10000) * 0.15; taxableIncome = 10000; }
  if (taxableIncome > 5000)  { tax += (taxableIncome - 5000)  * 0.10; taxableIncome = 5000; }
  if (taxableIncome > 0)     { tax += taxableIncome * 0.05; }

  const monthlyTax = tax / 12;

  // الضمان
  let maxSalary;
  if (registration === "retired") maxSalary = 0;
  else if (registration === "before2009") maxSalary = 5000;
  else maxSalary = 3612;

  const ssSalary = Math.min(salary, maxSalary);
  const employeeSS = ssSalary * 0.075;
  const employerSS = ssSalary * 0.1425;

  resultsDiv.classList.remove("hidden");
  resultsDiv.innerHTML = `
    <p><b>Annual Salary:</b> ${annualSalary.toFixed(2)}</p>
    <p><b>Exemptions:</b> ${exemptions.toFixed(2)}</p>
    <p><b>Taxable Income:</b> ${taxableBase.toFixed(2)}</p>
    <p><b>Annual Tax:</b> ${tax.toFixed(2)}</p>
    <p><b>Monthly Tax:</b> ${monthlyTax.toFixed(2)}</p>
    <p><b>Employee Social Security:</b> ${employeeSS.toFixed(2)}</p>
    <p><b>Employer Social Security:</b> ${employerSS.toFixed(2)}</p>
  `;
}
