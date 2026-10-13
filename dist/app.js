const byId = (id) => document.getElementById(id);

// 数学彩蛋：积分像一位挑剔的评委，洛朗级数里只给 −1 次幂亮灯。
const termStories = {
  minus2: { label: '这一项会消失', symbol: '0', text: '∮ a₋₂/(z−z₀)² dz = 0。它绕了一圈，正负贡献刚好抵消。' },
  minus1: { label: '被圈出来的主角', symbol: 'a₋₁', text: '这一项的绕圈积分是 2πi · a₋₁。因此 Res(f, z₀) = a₋₁。' },
  zero: { label: '常数项也会消失', symbol: '0', text: '∮ a₀ dz = 0。闭合路径回到起点，常数项没有留下净贡献。' }
};

document.querySelectorAll('.series-term').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.series-term').forEach((item) => {
      item.classList.toggle('selected', item === button);
      item.setAttribute('aria-pressed', String(item === button));
    });
    const story = termStories[button.dataset.term];
    byId('term-response').innerHTML = `<div><span class="response-label">${story.label}</span><strong>${story.symbol}</strong></div><p>${story.text}</p>`;
  });
});

const slider = byId('radius-slider');
function updateContour() {
  const radius = Number(slider.value) / 100;
  const onPole = Math.abs(radius - 1) < 0.0001;
  const includesOne = radius > 1;
  byId('radius-output').textContent = radius.toFixed(2);
  byId('contour-circle').setAttribute('r', String(radius * 100));
  byId('radius-label').textContent = `r = ${radius.toFixed(2)}`;
  byId('radius-label').setAttribute('x', String(Math.min(190 + radius * 55, 300)));
  byId('radius-label').setAttribute('y', String(Math.max(155 - radius * 80, 35)));
  byId('pole-one-row').classList.toggle('inside', includesOne);
  byId('pole-one-row').querySelector('.pole-state').textContent = onPole ? '线上' : includesOne ? '圈内' : '圈外';
  byId('pole-zero-row').querySelector('.pole-state').textContent = '圈内';
  byId('pole-one-halo').setAttribute('opacity', includesOne ? '.35' : '.12');

  // 数学彩蛋：边界上的极点就像坐在门槛上的客人，留数定理不替它安排座位。
  if (onPole) {
    byId('case-title').textContent = '围道穿过 z = 1';
    byId('case-pill').textContent = '边界警报';
    byId('integral-result').textContent = '未定义';
    byId('integral-result').classList.add('undefined');
    byId('result-detail').textContent = 'f 在路径上有奇点，通常的围道积分不存在';
    byId('lab-comment').innerHTML = '<span>✳ 数学旁白</span> 圈线正好压在奇点 1 上，不能直接套留数定理。先把它移进或移出。';
  } else if (includesOne) {
    // −1 与 +1 相加为 0：两个留数在同一个圈里“握手言和”。
    byId('case-title').textContent = '两个奇点都在圈内';
    byId('case-pill').textContent = '2 个奇点';
    byId('integral-result').textContent = '0';
    byId('integral-result').classList.remove('undefined');
    byId('result-detail').textContent = '2πi × (−1 + 1) = 0';
    byId('lab-comment').innerHTML = '<span>✳ 数学旁白</span> 两个留数一正一负，结伴进入后刚好抵消；圈画得更大，结果反而变成 0。';
  } else {
    byId('case-title').textContent = '只围住 z = 0';
    byId('case-pill').textContent = '1 个奇点';
    byId('integral-result').textContent = '−2πi';
    byId('integral-result').classList.remove('undefined');
    byId('result-detail').textContent = '2πi × (−1) = −2πi';
    byId('lab-comment').innerHTML = '<span>✳ 数学旁白</span> 奇点 1 站在圈外，再抢眼也暂时没有投票权。';
  }
}
slider.addEventListener('input', updateContour);
updateContour();

const examples = [
  {
    number: '01', title: '圈住原点，求留数', tag: '一阶极点', question: 'f(z) = 1/[z(z−1)]，求 Res(f, 0)',
    steps: [
      ['认出极点', '分母有一个 z；在 z = 0 是一阶极点。'],
      ['乘回 (z−0)', 'z · f(z) = 1/(z−1)'],
      ['取极限', 'Res(f, 0) = lim(z→0) 1/(z−1) = −1']
    ],
    comments: ['✳ 数学旁白：先认清极点的“阶”，工具才不会拿错。', '✳ 数学旁白：这个 z 被约掉，真正的常数露面了。', '✳ 数学旁白：负号别丢，它会决定整圈积分的方向感。']
  },
  {
    number: '02', title: '分母求导，一步到位', tag: '简单零点', question: 'f(z) = (z+2)/(z²+1)，求 Res(f, i)',
    steps: [
      ['确认条件', 'h(z) = z²+1，h(i) = 0，h′(i) = 2i ≠ 0'],
      ['套用捷径', 'Res(f, i) = g(i)/h′(i) = (i+2)/(2i)'],
      ['化简结果', '(i+2)/(2i) = 1/2 − i']
    ],
    comments: ['✳ 数学旁白：导数不为零，说明分母是“轻轻穿过”零点。', '✳ 数学旁白：g/h′ 是一阶极点的快捷通道。', '✳ 数学旁白：记住 1/i = −i，复数化简就顺了。']
  },
  {
    number: '03', title: '二阶极点，求一次导', tag: '二阶极点', question: 'f(z) = eᶻ/(z−1)²，求 Res(f, 1)',
    steps: [
      ['确认阶数', '(z−1)² 在分母，z = 1 是二阶极点。'],
      ['先消去极点', '(z−1)² f(z) = eᶻ'],
      ['求 m−1 次导', 'Res(f, 1) = [d(eᶻ)/dz]₍z₌₁₎ = e']
    ],
    comments: ['✳ 数学旁白：二阶极点不用慌，它只要求导一次。', '✳ 数学旁白：外壳一脱，里面是最熟悉的 eᶻ。', '✳ 数学旁白：求导抽出 eᶻ 的一次项系数，答案就是 e。']
  }
];
let currentExample = 0;
let revealed = 0;
function renderExample() {
  const ex = examples[currentExample];
  byId('example-number').textContent = ex.number;
  byId('example-title').textContent = ex.title;
  byId('example-tag').textContent = ex.tag;
  byId('example-question').textContent = ex.question;
  byId('example-panel').setAttribute('aria-labelledby', `tab-${currentExample + 1}`);
  byId('example-steps').replaceChildren();
  byId('step-counter').textContent = `已揭晓 ${revealed} / ${ex.steps.length} 步`;
  byId('next-step').disabled = revealed >= ex.steps.length;
  byId('next-step').innerHTML = revealed >= ex.steps.length ? '本题完成 ✓' : '揭晓下一步 <span aria-hidden="true">→</span>';
  byId('example-comment').textContent = revealed ? ex.comments[revealed - 1] : '✳ 数学旁白：先自己试 10 秒，再揭晓第一步。';
  ex.steps.slice(0, revealed).forEach(([label, formula], index) => {
    const step = document.createElement('div');
    step.className = 'step';
    const number = document.createElement('span');
    number.className = 'step-num';
    number.textContent = String(index + 1);
    const content = document.createElement('div');
    const caption = document.createElement('p');
    caption.textContent = label;
    const expression = document.createElement('div');
    expression.className = 'step-formula';
    expression.textContent = formula;
    content.append(caption, expression);
    step.append(number, content);
    byId('example-steps').append(step);
  });
}
document.querySelectorAll('.example-tabs button').forEach((button) => {
  button.addEventListener('click', () => {
    currentExample = Number(button.dataset.example);
    revealed = 0;
    document.querySelectorAll('.example-tabs button').forEach((tab) => {
      const active = tab === button;
      tab.classList.toggle('active', active);
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
    });
    renderExample();
  });
  button.addEventListener('keydown', (event) => {
    const tabs = [...document.querySelectorAll('.example-tabs button')];
    const position = tabs.indexOf(button);
    const moves = { ArrowRight: position + 1, ArrowDown: position + 1, ArrowLeft: position - 1, ArrowUp: position - 1, Home: 0, End: tabs.length - 1 };
    if (!(event.key in moves)) return;
    event.preventDefault();
    // 数学彩蛋：例题标签也绕圈；走到最后一个，再向右就回到第一个。
    const next = tabs[(moves[event.key] + tabs.length) % tabs.length];
    next.click();
    next.focus();
  });
});
byId('next-step').addEventListener('click', () => {
  if (revealed < examples[currentExample].steps.length) revealed += 1;
  renderExample();
});
renderExample();

window.addEventListener('scroll', () => {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  byId('reading-progress').style.width = `${maxScroll > 0 ? window.scrollY / maxScroll * 100 : 0}%`;
}, { passive: true });
