const API_KEY = "b1dca6ed0ad6a07314bee3f497510fdc";
const API_FORECAST = "https://api.openweathermap.org/data/2.5/forecast";
const API_CURRENT  = "https://api.openweathermap.org/data/2.5/weather";   

const $  = (sel, root=document) => root.querySelector(sel);
const $$ = (sel, root=document) => [...root.querySelectorAll(sel)];

const LAST_KEY = "owm.lastQuery";
function saveLast(q){ try{ localStorage.setItem(LAST_KEY, q); }catch{} }
function loadLast(){ try{ return localStorage.getItem(LAST_KEY) || ""; }catch{ return ""; } }

function fTemp(n){ return `${Math.round(n)}°F`; }
function fSpeed(mph){ return `${Math.round(mph)} mph`; }
function fTimeFromUnix(unix, tzOffsetSec=0){
  const d = new Date((unix + tzOffsetSec) * 1000);
  return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}
function fDateFromUnix(unix, tzOffsetSec=0){
  const d = new Date((unix + tzOffsetSec) * 1000);
  return d.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" });
}
function iconUrl(code){ return `https://openweathermap.org/img/wn/${code}@2x.png`; }

function themeFromWeatherId(id){
  if(id >= 200 && id < 300) return "theme-thunder";
  if(id >= 300 && id < 600) return "theme-rain";
  if(id >= 600 && id < 700) return "theme-snow";
  if(id >= 700 && id < 800) return "theme-mist";
  if(id === 800)            return "theme-sunny";
  if(id > 800)              return "theme-clouds";
  return "theme-default";
}
function applyTheme(id){
  const cls = themeFromWeatherId(id);
  document.body.className = cls || "theme-default";
}

async function fetchCurrentByCity(query){
  const url = new URL(API_CURRENT);
  url.searchParams.set("q", query);
  url.searchParams.set("appid", API_KEY);
  url.searchParams.set("units", "imperial");
  const res = await fetch(url);
  if(!res.ok){
    const txt = await res.text().catch(()=> "");
    throw new Error(`Current error (${res.status}): ${txt || res.statusText}`);
  }
  return res.json(); 
}

async function fetchForecastByCity(query){
  const url = new URL(API_FORECAST);
  url.searchParams.set("q", query);
  url.searchParams.set("appid", API_KEY);
  url.searchParams.set("units", "imperial");
  const res = await fetch(url);
  if(!res.ok){
    const txt = await res.text().catch(()=> "");
    throw new Error(`Forecast error (${res.status}): ${txt || res.statusText}`);
  }
  return res.json();
}

function toDailyFrom3h(list){
  const byDate = new Map();
  for(const item of list){
    const d = new Date(item.dt * 1000);
    const key = `${d.getUTCFullYear()}-${String(d.getUTCMonth()+1).padStart(2,"0")}-${String(d.getUTCDate()).padStart(2,"0")}`;
    if(!byDate.has(key)) byDate.set(key, []);
    byDate.get(key).push(item);
  }
  const daily = [];
  for(const [,arr] of byDate){
    const max = Math.max(...arr.map(x=>x.main.temp_max));
    const min = Math.min(...arr.map(x=>x.main.temp_min));
    arr.sort((a,b)=>{
      const ha = new Date(a.dt*1000).getUTCHours();
      const hb = new Date(b.dt*1000).getUTCHours();
      return Math.abs(ha-12) - Math.abs(hb-12);
    });
    const pick = arr[0];
    daily.push({
      dt: pick.dt,
      temp: { max, min },
      weather: pick.weather,
      humidity: pick.main.humidity,
      wind_speed: pick.wind?.speed ?? 0,
      clouds: pick.clouds?.all ?? 0
    });
  }
  return daily.slice(0,5);
}

window.WX = {
  $, $$, fTemp, fSpeed, fTimeFromUnix, fDateFromUnix, iconUrl,
  applyTheme, fetchCurrentByCity, fetchForecastByCity, toDailyFrom3h,
  saveLast, loadLast
};
