// Complete specialty keyword map — 61 specialties, English + Urdu + Roman Urdu
const SMAP = [
  { s: "Cardiology", k: ["heart","cardiac","chest pain","chest tightness","chest pressure","palpitation","irregular heartbeat","fast heartbeat","racing heart","heart racing","hypertension","high blood pressure","low blood pressure","blood pressure","angina","heart attack","heart failure","heart disease","arrhythmia","atrial fibrillation","afib","pacemaker","angioplasty","angiogram","stent","ecg","echo","echocardiogram","cardiologist","heart specialist","leg swelling heart","edema","dil","dil ki bimari","dil ka dard","dil ki dhadkan"] },
  { s: "Cardiothoracic Surgery", k: ["heart surgery","bypass surgery","open heart surgery","valve replacement","valve surgery","cardiothoracic","thoracic surgery","chest surgery","heart operation"] },
  { s: "Paediatric Cardiology", k: ["child heart problem","baby heart","infant heart","congenital heart disease","hole in heart","bachay ka dil"] },
  { s: "Vascular Surgery", k: ["varicose vein","varicose veins","vascular","peripheral artery disease","aortic aneurysm","deep vein thrombosis","dvt","blood clot in leg","leg vein problem"] },
  { s: "Neurology", k: ["headache","head pain","head ache","migraine","severe headache","chronic headache","headache for days","seizure","epilepsy","fits","convulsion","stroke","brain stroke","paralysis","face drooping","tremor","shaking hands","parkinson","alzheimer","dementia","memory loss","memory problem","vertigo","dizziness","room spinning","blackout","loss of consciousness","numbness","tingling","pins and needles","weakness in arm","weakness in leg","slurred speech","neuro","neurologist","brain problem","nerve problem","sar dard","sir dard","sar mein dard","sir mein dard","chakkar","chaker"] },
  { s: "Neuro Surgery", k: ["brain surgery","brain tumor","brain tumour","brain cancer","spinal cord injury","spine surgery","herniated disc","slipped disc","disc problem","disc bulge","neurosurgeon","back surgery","neck surgery spinal"] },
  { s: "Paediatric Neurology", k: ["child seizure","child epilepsy","child fits","baby fits","infant seizure","childhood stroke","child weakness","bachay ko fits","bachay ke dore"] },
  { s: "Psychiatry", k: ["depression","depressed","feel depressed","feeling depressed","feeling sad","feeling low","feel low","no motivation","lost interest","hopeless","worthless","anxiety","anxious","anxiety disorder","panic attack","panic disorder","mental health","mental illness","mental problem","bipolar","schizophrenia","ocd","obsessive compulsive","ptsd","trauma","hallucination","mood disorder","mood swings","suicidal","self harm","insomnia","cannot sleep","cant sleep","not sleeping","sleep problem","stress disorder","phobia","social anxiety","psychiatrist","mental doctor","udassi","udas rehna","neend nahi aati","ghabrahat"] },
  { s: "Clinical Psychology", k: ["psychologist","counselling","counseling","therapy","cbt","cognitive behavioral therapy","talk therapy","psychological assessment","emotional support","mental counselling"] },
  { s: "Paediatric Psychology", k: ["child behavior problem","child behaviour problem","child mental health","autism","autistic child","adhd","attention deficit","child anxiety","child depression","bachay ka behavior"] },
  { s: "Orthopaedic Surgery", k: ["back pain","backache","lower back pain","back ache","upper back pain","knee pain","knee problem","knee surgery","knee injury","knee swelling","hip pain","hip replacement","hip problem","shoulder pain","shoulder injury","frozen shoulder","rotator cuff","foot pain","feet pain","ankle pain","ankle injury","ankle sprain","ankle swelling","leg pain","arm pain","wrist pain","elbow pain","neck pain","neck stiffness","fracture","broken bone","bone fracture","bone pain","joint pain","joint problem","joint replacement","sports injury","spine problem","scoliosis","osteoporosis","ligament tear","tendon injury","acl tear","meniscus","orthopaedic","orthopedic","bone doctor","kamar dard","kamar mein dard","kamar mein dard hy","paon mein dard","paon mein dard hy","paon","paaon","paoo","paav","pao","paaon mein dard","paoo mein dard","tang","tang mein dard","tang mein dard hy","ghutna","ghutna dard","kandha","haddi","haddi ka dard","joron ka dard","mujhe dard","mujhay dard"] },
  { s: "Rheumatology", k: ["rheumatoid arthritis","rheumatoid","lupus","autoimmune disease","gout","gout attack","uric acid high","sjogren","ankylosing spondylitis","fibromyalgia","joint inflammation","joint swelling","morning stiffness","rheumatologist","joron ki sujan","joron ki akran"] },
  { s: "Physiotherapy", k: ["physiotherapy","physiotherapist","physio","physical therapy","post surgery rehab","muscle rehab","movement therapy","mobility problem","exercise therapy"] },
  { s: "Rehabilitative Medicine", k: ["rehabilitation medicine","rehab medicine","disability rehabilitation","neurological rehab","stroke rehab","post stroke recovery"] },
  { s: "Pain Medicine – Anaesthesiology", k: ["chronic pain","pain management","pain clinic","pain specialist","nerve pain","nerve block","pain medicine","persistent pain"] },
  { s: "Gastroenterology", k: ["stomach pain","stomach ache","stomach problem","stomach cramps","abdominal pain","abdominal cramps","tummy pain","belly pain","gastro","gastroenterologist","liver problem","liver disease","liver pain","hepatitis","hepatitis c","hepatitis b","jaundice","yellow eyes","yellow skin","gallbladder problem","gallstone","gall stone","gallbladder pain","pancreas","pancreatitis","acidity","acid reflux","reflux","heartburn","gerd","ulcer","gastric ulcer","peptic ulcer","stomach ulcer","ibs","irritable bowel","crohn disease","colitis","colon problem","constipation","diarrhea","diarrhoea","loose motion","loose motions","loose stool","watery stool","vomiting","nausea","bloating","gas problem","excess gas","piles","haemorrhoid","rectal bleeding","blood in stool","pet dard","pet mein dard","qay","ultee","kabz","dast","aisaal"] },
  { s: "Paediatric Gastroenterology", k: ["child stomach pain","child vomiting","child liver problem","infant jaundice","baby jaundice","child loose motion","bachay ka pet dard","bachay ko qay"] },
  { s: "General Surgery", k: ["hernia","hernia operation","appendix pain","appendicitis","laparoscopy","laparoscopic surgery","bariatric surgery","weight loss surgery","abscess","cyst removal","lump removal","abdominal surgery","general surgery"] },
  { s: "Pulmonology", k: ["asthma","asthma attack","breathing problem","difficulty breathing","shortness of breath","breathlessness","chest tightness breathing","copd","chronic bronchitis","bronchitis","chronic cough","cough for weeks","cough for months","persistent cough","dry cough","wet cough","pneumonia","tuberculosis","tb","lung problem","lung disease","chest infection","respiratory problem","sleep apnea","snoring","phlegm","sputum","mucus","wheezing","lung specialist","pulmonologist","sans lene mein takleef","khansee","khasi"] },
  { s: "Endocrinology", k: ["diabetes","sugar problem","blood sugar high","blood sugar low","high sugar","low sugar","diabetic","type 1 diabetes","type 2 diabetes","prediabetes","hba1c","insulin problem","thyroid","thyroid problem","hypothyroidism","hyperthyroidism","thyroid swelling","goitre","goiter","hashimoto","graves disease","hormone problem","hormonal imbalance","pituitary problem","adrenal problem","polycystic","metabolic syndrome","sugar doctor","thyroid doctor","endocrinologist"] },
  { s: "Paediatric Endocrinology", k: ["child diabetes","child thyroid problem","child growth problem","child short height","short stature child","bachay ki growth","bachay ki sugar"] },
  { s: "Nutrition", k: ["nutritionist","dietitian","diet plan","weight management","obesity","vitamin deficiency","vitamin d low","iron deficiency","malnutrition","eating plan","nutrition advice"] },
  { s: "Nephrology", k: ["kidney problem","kidney disease","kidney failure","renal failure","dialysis","protein in urine","blood in urine","creatinine high","urea high","kidney stone","nephrotic syndrome","chronic kidney disease","kidney specialist","nephrologist","gurda","gurda kharab","gurday ki takleef"] },
  { s: "Paediatric Nephrology", k: ["child kidney problem","infant kidney","bachay ka gurda"] },
  { s: "Urology", k: ["prostate","prostate problem","enlarged prostate","bladder problem","urinary problem","difficulty urinating","frequent urination","urinary incontinence","urine leakage","bladder stone","urinary tract infection","uti","urine infection","burning urination","erectile dysfunction","male problem","urologist","peshab ki takleef","peshab mein jalan","peshab ruk jana"] },
  { s: "Obstetrics and Gynaecology", k: ["pregnancy","pregnant","prenatal","antenatal","delivery","c-section","caesarean","normal delivery","gynae","gynaecologist","period problem","irregular period","painful period","heavy period","missed period","no period","pcos","polycystic ovary syndrome","fertility","infertility","ivf","cannot conceive","trying for baby","uterus problem","uterus fibroid","ovary problem","ovarian cyst","menopause","cervical cancer","pap smear","hpv","vaginal discharge","ectopic pregnancy","miscarriage","female doctor","lady doctor","women doctor","hamal","maahwari","maahwari ka masla","bachi dani"] },
  { s: "Breast Surgery", k: ["breast lump","breast pain","breast problem","breast cancer","mastectomy","breast surgery","breast specialist","breast biopsy","breast swelling"] },
  { s: "General Paediatrics", k: ["child problem","baby problem","infant problem","newborn problem","toddler problem","child fever","baby fever","child not well","child sick","child not eating","baby not eating","child vomiting","child diarrhea","child cough","child cold","child rash","child infection","child specialist","children doctor","child doctor","paediat","pediatr","paediatrician","my child","my baby","mera bacha","meri bachi","mere bachay","mera beta","meri beti","baccha","bachay ko bukhaar","bachay ko bukhaar hy","bachay ko bukhaar hai","bachay ko khansee","bachay ko dast","bachay ko qay","bachay ka doctor","mera bacha beemar","mera bachcha","mere bachche","bacche ko","baccha beemar"] },
  { s: "Paediatric Surgery", k: ["child surgery","baby surgery","infant surgery","child operation","hernia in child","bachay ka operation"] },
  { s: "Paediatric Neonatology", k: ["premature baby","preterm baby","nicu","newborn icu","premature infant","neonatal","low birth weight baby"] },
  { s: "ENT (Otolaryngology)", k: ["ear problem","ear pain","ear ache","ear infection","hearing loss","deaf","tinnitus","ringing in ear","ear discharge","nose problem","blocked nose","stuffy nose","runny nose","nosebleed","sore throat","throat problem","throat pain","tonsil","tonsillitis","sinusitis","sinus problem","nasal polyp","voice problem","hoarse voice","adenoid","snoring problem","ent doctor","ear nose throat","kan","naak","gala","kan mein dard","glay mein kharish"] },
  { s: "Ophthalmology", k: ["eye problem","eye pain","eye ache","eye infection","red eye","blurred vision","blurry vision","vision problem","vision loss","weak eyesight","poor eyesight","cataract","glaucoma","retina problem","squint","lazy eye","dry eye","watery eye","macular degeneration","lasik","cornea problem","eye specialist","ophthalmologist","aankhein","aankhon mein dard","aankhon se kam dikhna","dhundla dikhna"] },
  { s: "Dermatology", k: ["skin problem","skin issue","skin condition","acne","pimples","pimple problem","eczema","psoriasis","skin rash","rash","redness on skin","itching","skin itching","severe itching","hair loss","hair fall","alopecia","nail problem","fungal infection","ringworm","wart","mole","vitiligo","white patches","skin infection","hives","urticaria","dry skin","atopic dermatitis","skin darkening","dermatologist","skin doctor","skin specialist","khujli","jild ki bimari","baal girna","daane"] },
  { s: "Medical Oncology", k: ["cancer","tumor","tumour","malignant","malignancy","chemotherapy","chemo","lymphoma","leukemia","blood cancer","biopsy result cancer","metastasis","oncologist","cancer doctor","cancer specialist","cancer treatment"] },
  { s: "Radiation Oncology", k: ["radiation therapy","radiotherapy","radiation treatment","radiation oncology","cobalt therapy"] },
  { s: "Clinical Haematology", k: ["blood disorder","blood disease","thalassemia","sickle cell anaemia","platelet low","low platelets","bleeding disorder","haematologist","blood cancer","anaemia","anemia","low hemoglobin","low haemoglobin"] },
  { s: "Haematology", k: ["haematology","hematology","blood specialist"] },
  { s: "Internal Medicine", k: ["fever","high fever","low grade fever","flu","cold","body ache with fever","general weakness","fatigue","tiredness","tired all the time","not feeling well","feeling sick","feeling unwell","general checkup","routine checkup","full body checkup","annual checkup","typhoid","dengue","dengue fever","malaria","viral fever","general doctor","general physician","gp","internist","bukhaar","bukhar","bokhar","tez bukhaar","bukhaar hy","bukhaar hai","bachay ko bukhaar","mujhe bukhaar","kamzori","thakan","body dard"] },
  { s: "Family Medicine", k: ["family doctor","family medicine","family physician","preventive care","vaccination","health screening","routine health","ghar ka doctor"] },
  { s: "Infectious Diseases", k: ["hiv","aids","hepatitis b chronic treatment","hepatitis c treatment","antibiotic resistant infection","chronic infection treatment","tb treatment","tropical disease","infectious disease specialist"] },
  { s: "Emergency Medicine", k: ["emergency","accident","trauma injury","urgent care","critical condition","severe injury","emergency doctor"] },
  { s: "Plastic Surgery", k: ["plastic surgery","reconstructive surgery","burn injury","burn treatment","scar removal","scar revision","cosmetic surgery","rhinoplasty","nose job","skin graft","cleft lip"] },
  { s: "Radiology", k: ["mri scan","ct scan","ultrasound","x-ray","imaging","radiology","scan report","mri result","ultrasound result"] },
  { s: "Dentistry", k: ["tooth problem","teeth problem","toothache","tooth pain","gum problem","gum disease","gum bleeding","cavity","root canal","dental","dentist","braces","oral health","tooth extraction","wisdom tooth","daant","maseray","daanton mein dard"] },
  { s: "Speech and Occupational Therapy", k: ["speech problem","speech therapy","stuttering","stammering","lisping","swallowing difficulty","swallowing problem","dysphagia","occupational therapy","bolne mein takleef"] },
  { s: "Palliative Care", k: ["palliative care","end of life care","terminal cancer","hospice","pain management terminal","comfort care"] },
];

const COMBOS = [
  { specs: ["Cardiology"],            needs: ["chest pain","breath"],       bonus: 15 },
  { specs: ["Cardiology"],            needs: ["chest","arm pain"],           bonus: 20 },
  { specs: ["Pulmonology","Cardiology"], needs: ["breathing","chest"],       bonus: 12 },
  { specs: ["Gastroenterology"],      needs: ["yellow","fatigue"],           bonus: 15 },
  { specs: ["Endocrinology"],         needs: ["thirst","urination"],         bonus: 18 },
  { specs: ["Rheumatology"],          needs: ["joint","rash"],               bonus: 15 },
  { specs: ["Neurology"],             needs: ["headache","vision"],          bonus: 12 },
  { specs: ["Psychiatry"],            needs: ["anxious","heart racing"],     bonus: 12 },
  { specs: ["General Paediatrics"],   needs: ["child","fever"],              bonus: 12 },
  { specs: ["General Paediatrics"],   needs: ["bacha","bukhaar"],            bonus: 12 },
  { specs: ["Orthopaedic Surgery"],   needs: ["kamar","dard"],               bonus: 15 },
  { specs: ["Orthopaedic Surgery"],   needs: ["paoo","dard"],                bonus: 15 },
  { specs: ["Dermatology"],           needs: ["itching","rash"],             bonus: 12 },
  { specs: ["ENT (Otolaryngology)"],  needs: ["ear","throat"],               bonus: 8  },
];

const NEGATIONS = [
  { pattern: /no (?:chest|heart)/i,    spec: "Cardiology",       penalty: 20 },
  { pattern: /no (?:stomach|belly)/i,  spec: "Gastroenterology", penalty: 15 },
  { pattern: /not (?:diabetic|sugar)/i,spec: "Endocrinology",    penalty: 15 },
];

const AFFIRMATIVES = /^(yes|no|ok|okay|haan|nahi|theek|sure|show|more|book|done|thanks|shukriya|another|different|back|confirm|ji|nhi|hmm|ahan|acha|thik|bilkul|zaroor|ek aur|aur dikhao|show more|show all)\b/i;

const SENIORITY: Record<string, number> = {
  "Clinical Professor": 8, "Professor": 7, "Associate Professor": 6,
  "Clinical Associate Professor": 5, "Senior Consultant": 5, "Consultant": 5,
  "Assistant Professor": 4, "Senior Lecturer": 3, "Lecturer": 2,
  "Family Physician": 2, "Senior Instructor": 2, "Instructor": 1,
  "Allied Health Professional": 1,
};

export const getSeniority = (title?: string) => SENIORITY[title ?? ""] ?? 0;

export const detectSpecs = (text: string): string[] => {
  const t = " " + text.toLowerCase() + " ";
  const scores: Record<string, number> = {};

  for (const e of SMAP) {
    let score = 0;
    for (const kw of e.k) if (t.includes(kw)) score += kw.split(" ").length * 2 + 1;
    if (score > 0) scores[e.s] = (scores[e.s] ?? 0) + score;
  }

  for (const combo of COMBOS) {
    if (combo.needs.every((kw) => t.includes(kw))) {
      for (const spec of combo.specs) scores[spec] = (scores[spec] ?? 0) + combo.bonus;
    }
  }

  for (const neg of NEGATIONS) {
    if (neg.pattern.test(text) && scores[neg.spec]) {
      scores[neg.spec] = Math.max(0, scores[neg.spec] - neg.penalty);
    }
  }

  return Object.entries(scores)
    .filter(([, v]) => v > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([s]) => s);
};

export const isAffirmative = (text: string) => AFFIRMATIVES.test(text.trim());

export const getAllSpecialtyNames = () => SMAP.map((e) => e.s);
