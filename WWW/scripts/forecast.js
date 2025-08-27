console.log("[Forecast.js] loaded");

const form       = WX.$("#searchForm");
const queryInput = WX.$("#query");
const useLastBtn = WX.$("#useLastBtn");
const metaEl     = WX.$("#meta");
const daysEl     = WX.$("#days");

function dayCard(d){
  const w = d.weather?.[0] || {};
  const themeId = w.id ?? 800;
  const dateStr = WX.fDateFromUnix(d.dt, 0);
  return `
    <article class="day" data-theme="${themeId}">
      <h3>${dateStr}</h3>
      <div class="mini">
        <img class="wx-icon" src="${WX.iconUrl(w.icon || "01d")}" alt="${w.description || "weather"}" />
        <div>
          <div class="desc" style="text-transform:capitalize">${w.description || "—"}</div>
          <div class="highlow">High ${WX.fTemp(d.temp.max)} • Low ${WX.fTemp(d.temp.min)}</div>
        </div>
      </div>
      <ul class="kv" style="margin-top:10px">
        <li><span>Humidity</span><strong>${d.humidity ?? "—"}%</strong></li>
        <li><span>Wind</span><strong>${Math.round(d.wind_speed ?? 0)} mph</strong></li>
        <li><span>Clouds</span><strong>${d.clouds ?? "—"}%</strong></li>
      </ul>
    </article>
  `;
}

async function loadForecast(query){
  metaEl.textContent = "Loading…";
  daysEl.innerHTML = "";

  try{
    const f = await WX.fetchForecastByCity(query);
    const city = f.city;

    const daily5 = WX.toDailyFrom3h(f.list);

    const themeId = (daily5[0]?.weather?.[0]?.id) ?? 800;
    WX.applyTheme(themeId);

    metaEl.textContent = `${city.name}, ${city.country} — Next 5 Days`;
    daysEl.innerHTML = daily5.map(dayCard).join("");

    WX.saveLast(query);
  }catch(err){
    console.error(err);
    metaEl.textContent = err.message || "Failed to load forecast. Check your city and API key.";
  }
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const q = (queryInput.value || "").trim();
  console.log("[Forecast.js] submit q=", q);
  if(!q) return;
  loadForecast(q);
});

useLastBtn.addEventListener("click", () => {
  const last = WX.loadLast();
  if(last){
    queryInput.value = last;
    loadForecast(last);
  }else{
    alert("No saved city yet. Search once to save it.");
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const last = WX.loadLast();
  if(last){
    queryInput.value = last;
    loadForecast(last);
  }
});
