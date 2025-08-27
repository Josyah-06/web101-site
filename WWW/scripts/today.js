console.log("[Today.js] loaded");

const form       = WX.$("#searchForm");
const queryInput = WX.$("#query");
const useLastBtn = WX.$("#useLastBtn");

const placeEl    = WX.$("#place");
const timeEl     = WX.$("#time");
const iconEl     = WX.$("#icon");
const tempEl     = WX.$("#temp");
const descEl     = WX.$("#desc");
const feelsEl    = WX.$("#feels");
const hiLoEl     = WX.$("#hiLo");
const humidityEl = WX.$("#humidity");
const windEl     = WX.$("#wind");
const sunriseEl  = WX.$("#sunrise");
const sunsetEl   = WX.$("#sunset");
const alertBox   = WX.$("#alert");

async function loadToday(query){
  console.log("[Today.js] loadToday:", query);
  alertBox.classList.add("hidden");
  alertBox.textContent = "";

  try{
    const cur = await WX.fetchCurrentByCity(query);
    console.log("[Today.js] current:", cur);

    const f = await WX.fetchForecastByCity(query);
    console.log("[Today.js] forecast:", f);

    const tz = cur.timezone ?? 0;
    const todayStr = new Date((cur.dt + tz) * 1000).toDateString();
    const sameDay = f.list.filter(x =>
      new Date((x.dt + tz) * 1000).toDateString() === todayStr
    );

    const highs = sameDay.map(x => x.main.temp_max);
    const lows  = sameDay.map(x => x.main.temp_min);
    const hi = highs.length ? Math.max(...highs) : cur.main.temp_max ?? cur.main.temp;
    const lo = lows.length  ? Math.min(...lows)  : cur.main.temp_min ?? cur.main.temp;

    placeEl.textContent = `${cur.name}, ${f.city.country}`;
    timeEl.textContent  = `${WX.fDateFromUnix(cur.dt, tz)} • Updated ${WX.fTimeFromUnix(cur.dt, tz)}`;

    const w = cur.weather?.[0];
    if(w){
      iconEl.src = WX.iconUrl(w.icon);
      iconEl.alt = w.description || "Weather icon";
      descEl.textContent = w.description || "—";
      WX.applyTheme(w.id);
    }else{
      iconEl.src = ""; iconEl.alt = ""; descEl.textContent = "—";
    }

    tempEl.textContent     = WX.fTemp(cur.main.temp);
    feelsEl.textContent    = WX.fTemp(cur.main.feels_like);
    hiLoEl.textContent     = `${WX.fTemp(hi)} / ${WX.fTemp(lo)}`;
    humidityEl.textContent = `${cur.main.humidity}%`;
    windEl.textContent     = WX.fSpeed(cur.wind?.speed ?? 0);
    sunriseEl.textContent  = WX.fTimeFromUnix(cur.sys.sunrise, tz);
    sunsetEl.textContent   = WX.fTimeFromUnix(cur.sys.sunset,  tz);

    WX.saveLast(query);
  }catch(err){
    console.error(err);
    alertBox.textContent = err.message || "Failed to load weather. Check your city and API key.";
    alertBox.classList.remove("hidden");
  }
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const q = (queryInput.value || "").trim();
  console.log("[Today.js] submit q=", q);
  if(!q) return;
  loadToday(q);
});

useLastBtn.addEventListener("click", () => {
  const last = WX.loadLast();
  if(last){
    queryInput.value = last;
    loadToday(last);
  }else{
    alert("No saved city yet. Search once to save it.");
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const last = WX.loadLast();
  if(last){
    queryInput.value = last;
    loadToday(last);
  }
});
