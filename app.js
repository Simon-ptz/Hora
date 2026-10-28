const $ = (id) => document.getElementById(id);
let data = null;
const direction = $('direction');
const departureStop = $('departure-stop');
const arrivalStop = $('arrival-stop');

const saved = (() => {
  try { return JSON.parse(localStorage.getItem('oleane-line-a-settings') || '{}'); }
  catch { return {}; }
})();

$('walk').value = Number.isFinite(saved.walk) ? saved.walk : 5;
$('margin').value = Number.isFinite(saved.margin) ? saved.margin : 3;

function saveSettings() {
  try {
    localStorage.setItem('oleane-line-a-settings', JSON.stringify({
      walk: +$('walk').value,
      margin: +$('margin').value,
      direction: direction.value,
      departureStop: departureStop.value,
      arrivalStop: arrivalStop.value
    }));
  } catch {}
}

function minutesOf(time) {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

function currentMinutes(d = new Date()) {
  return d.getHours() * 60 + d.getMinutes() + d.getSeconds() / 60;
}

function dayName(d) {
  return ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'][d.getDay()];
}

function typeForToday() {
  const d = new Date().getDay();
  return d === 6 ? 'saturday' : (d >= 1 && d <= 5 ? 'weekday' : 'sunday');
}

function populateStops() {
  if (!data) return;

  const names = data.stops;
  const ordered = direction.value === 'to_town' ? [...names].reverse() : [...names];

  const fillSelect = (select, currentValue) => {
    select.innerHTML = '';
    ordered.forEach((name) => {
      const option = document.createElement('option');
      option.value = name;
      option.textContent = name;
      select.appendChild(option);
    });

    if (ordered.includes(currentValue)) {
      select.value = currentValue;
    } else {
      select.value = ordered[0];
    }
  };

  fillSelect(departureStop, saved.departureStop || ordered[0]);
  fillSelect(arrivalStop, saved.arrivalStop || ordered[ordered.length - 1]);
}

function getTimes(type, dir, stopName) {
  if (type === 'sunday') return [];
  const key = (type === 'saturday' ? 'saturday' : 'weekday') + '_' + dir;
  return data.schedules[key]?.[stopName] || [];
}

function nextDepartures(times, now) {
  const nowMin = currentMinutes(now);
  let upcoming = times
    .map((t) => ({ time: t, mins: minutesOf(t) }))
    .filter((x) => x.mins >= nowMin - 0.01);

  return upcoming.slice(0, 4);
}

function update() {
  if (!data) return;

  const now = new Date();
  $('current-time').textContent = now.toLocaleTimeString('fr-FR');

  const type = typeForToday();
  const displayedType = type === 'weekday' ? 'LUN–VEN' : type === 'saturday' ? 'SAMEDI' : 'DIMANCHE';
  $('day-label').textContent = displayedType;

  const times = getTimes(type, direction.value, departureStop.value);
  const upcoming = nextDepartures(times, now);

  if (type === 'sunday') {
    $('countdown').innerHTML = '—<span>min</span>';
    $('next-time').textContent = '--:--';
    $('status').textContent = 'Horaires du dimanche non intégrés';
    $('progress').style.width = '0%';
    $('departures').innerHTML = '<p class="muted">Horaires du dimanche non disponibles.</p>';
    return;
  }

  if (!upcoming.length) {
    $('countdown').innerHTML = '—<span>min</span>';
    $('next-time').textContent = '--:--';
    $('status').textContent = 'Plus de passage prévu aujourd’hui';
    $('progress').style.width = '0%';
    $('departures').innerHTML = '<p class="muted">Aucun passage prévu pour cet arrêt aujourd’hui.</p>';
    return;
  }

  const next = upcoming[0];
  const diff = Math.max(0, Math.ceil(next.mins - currentMinutes(now)));

  $('countdown').innerHTML = diff + '<span>min</span>';
  $('next-time').textContent = next.time;
  $('status').textContent = 'Prochain passage à ' + departureStop.value;
  $('progress').style.width = Math.min(100, (upcoming.length / 4) * 100) + '%';

  $('departures').innerHTML = '';
  upcoming.forEach((item, i) => {
    const row = document.createElement('div');
    row.className = 'departure-row' + (i === 0 ? ' next' : '');

    const time = document.createElement('span');
    time.className = 'time';
    time.textContent = item.time;

    const label = document.createElement('span');
    label.className = 'label';
    label.textContent = i === 0 ? 'Prochain' : 'Ensuite';

    row.appendChild(time);
    row.appendChild(label);
    $('departures').appendChild(row);
  });

  const leave = next.mins - (+$('walk').value) - (+$('margin').value);
  const h = ((Math.floor(leave / 60) % 24) + 24) % 24;
  const m = ((leave % 60) + 60) % 60;
  $('leave-time').textContent = String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0');
  $('leave-note').textContent = 'Pour le prochain passage';
}

async function init() {
  try {
    const res = await fetch('./data/schedules.json');
    if (!res.ok) throw new Error('Fichier horaires introuvable');
    data = await res.json();

    if (saved.direction) direction.value = saved.direction;
    populateStops();

    if (saved.departureStop) departureStop.value = saved.departureStop;
    if (saved.arrivalStop) arrivalStop.value = saved.arrivalStop;

    update();
  } catch (error) {
    $('status').textContent = 'Impossible de charger les horaires';
    $('departures').innerHTML = '<p class="muted">Le fichier des horaires est introuvable.</p>';
    console.error(error);
  }
}

direction.addEventListener('change', () => {
  populateStops();
  saveSettings();
  update();
});

departureStop.addEventListener('change', () => {
  saveSettings();
  update();
});

arrivalStop.addEventListener('change', () => {
  saveSettings();
  update();
});

$('walk').addEventListener('input', () => {
  $('walk-value').textContent = $('walk').value;
  saveSettings();
  update();
});

$('margin').addEventListener('input', () => {
  $('margin-value').textContent = $('margin').value;
  saveSettings();
  update();
});

init();
