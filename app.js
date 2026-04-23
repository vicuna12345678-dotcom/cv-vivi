document.addEventListener('DOMContentLoaded', () => {
  const startBtn = document.getElementById('startBtn');
  const form = document.getElementById('quizForm');
  const resultSection = document.getElementById('resultSection');
  const resultTitle = document.getElementById('resultTitle');
  const resultTagline = document.getElementById('resultTagline');
  const resultDescription = document.getElementById('resultDescription');
  const scoreBarsContainer = document.getElementById('scoreBars');
  const dominantDimensionText = document.getElementById('dominantDimensionText');
  const restartBtn = document.getElementById('restartBtn');
  const savePosterBtn = document.getElementById('savePosterBtn');
  const copyLinkBtn = document.getElementById('copyLinkBtn');
  const toast = document.getElementById('toast');
  const shareCanvas = document.getElementById('shareCanvas');

  const QUESTION_CONFIG = {
    q1: { dimension: 'attitude', reverse: false },
    q2: { dimension: 'attitude', reverse: false },
    q3: { dimension: 'attitude', reverse: false },
    q4: { dimension: 'attitude', reverse: false },
    q5: { dimension: 'boundary', reverse: false },
    q6: { dimension: 'boundary', reverse: false },
    q7: { dimension: 'boundary', reverse: false },
    q8: { dimension: 'boundary', reverse: true },
    q9: { dimension: 'emotion', reverse: false },
    q10: { dimension: 'emotion', reverse: true },
    q11: { dimension: 'emotion', reverse: false },
    q12: { dimension: 'emotion', reverse: false },
    q13: { dimension: 'collab', reverse: false },
    q14: { dimension: 'collab', reverse: true },
    q15: { dimension: 'collab', reverse: false },
    q16: { dimension: 'collab', reverse: false },
    q17: { dimension: 'selfcare', reverse: false },
    q18: { dimension: 'selfcare', reverse: false },
    q19: { dimension: 'selfcare', reverse: false },
    q20: { dimension: 'selfcare', reverse: false },
    q21: { dimension: 'boundary', reverse: true },
    q22: { dimension: 'attitude', reverse: false },
    q23: { dimension: 'collab', reverse: false },
    q24: { dimension: 'selfcare', reverse: false },
  };

  const DIMENSION_META = {
    attitude: {
      label: '工作态度',
      description:
        '关注你对待任务、进度和成果的投入程度，是「安排王」还是「顺其自然派」，都没有对错。',
    },
    boundary: {
      label: '边界感',
      description:
        '描述你在说「不」、划清责任边界方面的习惯，既不是越高越好，也不是越低越糟，而是找到舒服的平衡点。',
    },
    emotion: {
      label: '情绪调适',
      description:
        '看你在压力和波动面前的自我安抚能力，有的人自带「稳住光环」，有人擅长用发疯和自嘲化解情绪。',
    },
    collab: {
      label: '协作风格',
      description:
        '反映你在团队里的沟通、对齐与出手习惯，是悄悄托底的隐形队友，还是站在台前的复读机担当。',
    },
    selfcare: {
      label: '自处与解压',
      description:
        '观察你如何和自己相处、如何放松充电。是会认真给自己放假的「开摆导师」，还是永远在线的打工圣体。',
    },
  };

  const PERSONAS = {
    '安排王': {
      label: '安排王',
      tagline: '你是别人嘴里的「放心交给 TA 就好」，一手抓进度，一手控节奏，开会拉群写 checklist 一条龙。',
      description:
        '你对任务拆解和时间管理有很强的掌控感，习惯把事情排好队、风险想在前面。别人焦虑的时候，你往往已经默默做好了 B 计划。偶尔也可以允许自己「不那么高效」，把日程表空出一小块，给脑袋放个假。',
    },
    '哦不人': {
      label: '哦不人',
      tagline: '传说中的风险雷达，你的口头禅可能是「等一下」「再想想」，但也正因为你，很多坑都被提前看见。',
      description:
        '你对细节和潜在问题非常敏感，脑内经常会上演「如果……那就……」的多线推演。看似爱多想，其实是在保护大家少踩坑。提醒自己：风险意识很宝贵，但也可以相信团队，有些小 bug 交给时间和版本迭代引掉就好。',
    },
    '摸鱼者': {
      label: '摸鱼者',
      tagline: '你精通在有限精力里选择性用力，「该上就上、该躺就躺」，是一种清醒的存活策略。',
      description:
        '你对「效率」有自己的理解：不是把每一分钟榨干，而是把力气花在真正重要的地方。你擅长在规则允许的空间里给自己留缓冲，摸鱼不是逃避，而是留出观察和思考的缝隙。只要核心事情有交付，适度躺平本身就是一种平衡。',
    },
    '稳住哥': {
      label: '稳住哥',
      tagline: '外界再 how 疯，你都是团队里的「情绪稳定器」，总能先把自己安顿好，再去安顿别人。',
      description:
        '你不一定情绪波动少，但你很会和情绪打交道。你知道什么时候该深呼吸，什么时候该转移注意力，也知道什么时候可以给自己一个「关机重启」。这种稳住不是强撑，而是对自己节奏的熟悉和尊重。',
    },
    '边界守门员': {
      label: '边界守门员',
      tagline: '你深知「好人」和「好说话的人」的区别，会努力做到对事负责、对自己也负责。',
      description:
        '你愿意帮助别人，但更在乎事情是不是合理、分工是否清晰。你会问清楚范围、确认优先级，也敢于在自己撑不住时说「我这边可能做不到」。这不是冷酷，而是一种成熟的合作方式。偶尔也别忘了给自己一点松动空间。',
    },
    '开摆导师': {
      label: '开摆导师',
      tagline: '你深谙「人不能总是打满格」的道理，会主动给自己安排合法开摆时间，让电量慢慢回血。',
      description:
        '你知道什么时候该冲、什么时候该停，习惯用小小的开摆仪式守护情绪：追剧、刷梗、发疯文案、点一杯好喝的饮品……在别人眼里你很会玩，其实你也很清楚底线在哪里。只要关键节点不掉链子，这种松弛感本身就是能力。',
    },
    '乐子人': {
      label: '乐子人',
      tagline: '你是团队里的气氛担当，总能把吐槽变成笑点，把压力变成梗，让大家在笑声中续一口气。',
      description:
        '你擅长用自嘲、玩笑和梗图把紧绷的情绪打散，愿意在群聊里抛出第一个梗，也乐于用轻松的方式连起不同的人。偶尔也记得：不用每次都当那个逗笑大家的人，你也可以只是安静地被照顾的一方。',
    },
    '隐身侠': {
      label: '隐身侠',
      tagline: '你更像是后台运行的系统进程，群里话不多，但关键节点总能看到你悄悄把活做完。',
      description:
        '你不太喜欢过多暴露在聚光灯下，更习惯用结果说话。你享受独处和安静工作带来的专注感，社交对你来说更像是「有限资源」。这样的你很适合承担需要耐心与深度的任务。也可以适时把成果说出来，让别人更容易看到你的努力。',
    },
    '复读机': {
      label: '复读机',
      tagline: '你是义务会议纪要生成器，擅长把混乱的信息整理成「人话」，帮所有人对齐到同一页。',
      description:
        '你会下意识地抓重点、拆结构，并把讨论结果复盘成清晰的结论或 TODO。虽然偶尔会觉得自己像「复读机」，但这份能力对团队来说非常稀缺。记得在复读的同时，也复读一下自己的需求：哪些事可以被简化，哪些事可以被替你分担。',
    },
    '钉子户': {
      label: '钉子户',
      tagline: '你在边界感这块站得很稳，有自己的判断和底线，不会轻易被情绪或人情裹挟。',
      description:
        '你对「这是我该做的事吗」这件事有清晰认知。不合理的要求，你会礼貌但明确地拒绝；真正重要的事，你又能异常坚持。别人可能会觉得你有点「轴」，但正是这种稳定让你不容易被卷跑。偶尔放松一点锋利，也能让合作更顺滑。',
    },
    '超纲王': {
      label: '超纲王',
      tagline: '你总忍不住多做半步，从需求到体验，从细节到风险，都想再抬一手。',
      description:
        '你对自己的要求往往「超出题目范围」，喜欢把事情做得更完整一点。这个特质会让你收获很多信任，但也容易在不知不觉中透支。给自己设个「交卷时间」，在做到 80 分的时候允许自己先提交，剩下 20 分交给迭代。',
    },
    '打工圣体': {
      label: '打工圣体',
      tagline: '你是那种「谁有事都先来找你」的老好人，责任心拉满，在线时间也拉满。',
      description:
        '你愿意为团队多走一步，也习惯优先照顾别人的需求。久而久之，很多「临时帮忙」都会自然地落到你身上。你的靠谱值得被看见，但也同样值得被好好保护。学着把「这次我可能接不下」说出口，是对自己和同事的双向负责。',
    },
  };

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.style.opacity = '1';
    clearTimeout(showToast._timer);
    showToast._timer = setTimeout(() => {
      toast.style.opacity = '0';
    }, 2600);
  }

  function computeScores() {
    const scores = {
      attitude: 0,
      boundary: 0,
      emotion: 0,
      collab: 0,
      selfcare: 0,
    };
    const counts = {
      attitude: 0,
      boundary: 0,
      emotion: 0,
      collab: 0,
      selfcare: 0,
    };

    let missing = null;

    Object.keys(QUESTION_CONFIG).forEach((name) => {
      if (missing) return;
      const config = QUESTION_CONFIG[name];
      const checked = document.querySelector(`input[name="${name}"]:checked`);
      if (!checked) {
        missing = name;
        return;
      }
      let v = parseInt(checked.value, 10) || 0;
      if (config.reverse) v = 6 - v; // Likert 1-5 反向
      scores[config.dimension] += v;
      counts[config.dimension] += 1;
    });

    if (missing) {
      return { error: missing };
    }

    const normalized = {};
    Object.keys(scores).forEach((dim) => {
      const max = counts[dim] * 5 || 1;
      const value = scores[dim] / max;
      normalized[dim] = Math.round(value * 100);
    });

    return { scores: normalized };
  }

  function pickPersona(scores) {
    const { attitude: att, boundary: bound, emotion: emo, collab, selfcare: self } = scores;

    const entries = [
      ['attitude', att],
      ['boundary', bound],
      ['emotion', emo],
      ['collab', collab],
      ['selfcare', self],
    ];
    entries.sort((a, b) => b[1] - a[1]);
    const topKey = entries[0][0];

    // 规则顺序：先识别极端特征，再落到主维度
    if (att >= 72 && bound <= 48) return '打工圣体';
    if (collab <= 45 && self >= 60) return '隐身侠';
    if (self >= 72 && att <= 50) return collab >= 55 ? '乐子人' : '摸鱼者';
    if (bound >= 75 && collab <= 55) return '钉子户';
    if (bound >= 72 && self >= 52) return '边界守门员';
    if (emo >= 78 && self >= 50) return '稳住哥';
    if (emo >= 65 && self <= 58) return '哦不人';
    if (collab >= 70 && emo >= 52 && emo <= 85) return '复读机';
    if (self >= 65 && emo >= 60 && att <= 60) return '开摆导师';
    if (collab >= 70 && att >= 60) return '安排王';

    switch (topKey) {
      case 'attitude':
        return att >= 70 ? '超纲王' : '安排王';
      case 'boundary':
        return '边界守门员';
      case 'emotion':
        return emo >= 70 ? '稳住哥' : '哦不人';
      case 'collab':
        return '复读机';
      case 'selfcare':
      default:
        return self >= 65 ? '开摆导师' : '摸鱼者';
    }
  }

  function renderScoreBars(scores) {
    scoreBarsContainer.innerHTML = '';
    const dims = ['attitude', 'boundary', 'emotion', 'collab', 'selfcare'];

    dims.forEach((key) => {
      const meta = DIMENSION_META[key];
      const value = scores[key] ?? 0;
      const row = document.createElement('div');
      row.className = 'score-row';

      const label = document.createElement('div');
      label.className = 'score-row-label';
      label.textContent = meta.label;

      const barWrap = document.createElement('div');
      barWrap.className = 'score-row-bar-wrap';

      const bar = document.createElement('div');
      bar.className = 'score-row-bar';
      bar.style.transform = `scaleX(${Math.max(0.08, value / 100)})`;

      barWrap.appendChild(bar);

      const val = document.createElement('div');
      val.className = 'score-row-value';
      val.textContent = value.toString();

      row.appendChild(label);
      row.appendChild(barWrap);
      row.appendChild(val);
      scoreBarsContainer.appendChild(row);
    });
  }

  function renderDominantDimension(scores) {
    const entries = Object.entries(scores);
    entries.sort((a, b) => b[1] - a[1]);
    const [topKey, topValue] = entries[0];
    const meta = DIMENSION_META[topKey];
    const text = `你当前最突出的一维是「${meta.label}」（约 ${topValue} 分），${meta.description}`;
    dominantDimensionText.textContent = text;
  }

  function generatePoster(personaKey, scores) {
    const persona = PERSONAS[personaKey];
    if (!shareCanvas || !persona) return;
    const ctx = shareCanvas.getContext('2d');
    const w = shareCanvas.width;
    const h = shareCanvas.height;

    // 背景渐变
    const bg = ctx.createLinearGradient(0, 0, 0, h);
    bg.addColorStop(0, '#e0f2fe');
    bg.addColorStop(0.4, '#eef2ff');
    bg.addColorStop(1, '#fee2e2');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    // 半透明卡片
    const cardX = 80;
    const cardY = 140;
    const cardW = w - 160;
    const cardH = h - 260;
    ctx.fillStyle = 'rgba(255,255,255,0.92)';
    ctx.strokeStyle = 'rgba(226,232,240,1)';
    ctx.lineWidth = 2;
    roundRect(ctx, cardX, cardY, cardW, cardH, 36, true, true);

    // 标题
    ctx.fillStyle = '#111827';
    ctx.font = 'bold 64px "Noto Sans SC", system-ui';
    ctx.fillText('职场发疯人格测试', 96, 120);

    ctx.font = '500 32px "Noto Sans SC", system-ui';
    ctx.fillStyle = '#4f46e5';
    ctx.fillText('轻松解压版 · 仅供娱乐', 96, 170);

    // 人格标签
    ctx.font = '500 26px "Noto Sans SC", system-ui';
    ctx.fillStyle = '#6b7280';
    ctx.fillText('你的结果标签是', cardX + 40, cardY + 80);

    ctx.font = 'bold 60px "Noto Sans SC", system-ui';
    ctx.fillStyle = '#111827';
    ctx.fillText(`「${persona.label}」`, cardX + 40, cardY + 150);

    // 简短 tagline
    ctx.font = '400 26px "Noto Sans SC", system-ui';
    ctx.fillStyle = '#374151';
    wrapText(ctx, persona.tagline, cardX + 40, cardY + 200, cardW - 80, 34);

    // 维度条形图
    const chartTop = cardY + 320;
    ctx.font = '500 26px "Noto Sans SC", system-ui';
    ctx.fillStyle = '#111827';
    ctx.fillText('五维度职场状态', cardX + 40, chartTop - 24);

    const dims = ['attitude', 'boundary', 'emotion', 'collab', 'selfcare'];
    const chartHeight = 220;
    const barWidthMax = cardW - 260;
    let y = chartTop;

    dims.forEach((key) => {
      const meta = DIMENSION_META[key];
      const value = scores[key] ?? 0;
      ctx.font = '400 24px "Noto Sans SC", system-ui';
      ctx.fillStyle = '#4b5563';
      ctx.fillText(meta.label, cardX + 40, y + 2);

      // 背景条
      const bx = cardX + 170;
      const by = y - 18;
      const bh = 18;
      ctx.fillStyle = '#e5e7eb';
      roundRect(ctx, bx, by, barWidthMax, bh, 999, true, false);

      const barLen = Math.max(barWidthMax * (value / 100), barWidthMax * 0.08);
      const grad = ctx.createLinearGradient(bx, by, bx + barLen, by);
      grad.addColorStop(0, '#6366f1');
      grad.addColorStop(1, '#06b6d4');
      ctx.fillStyle = grad;
      roundRect(ctx, bx, by, barLen, bh, 999, true, false);

      ctx.fillStyle = '#111827';
      ctx.font = '400 22px "Noto Sans SC", system-ui';
      ctx.fillText(`${value}`, bx + barWidthMax + 16, y + 2);

      y += chartHeight / dims.length;
    });

    // 左下角：娱乐声明
    ctx.font = '500 24px "Noto Sans SC", system-ui';
    ctx.fillStyle = '#111827';
    ctx.fillText('仅供娱乐 · 不做任何诊断或职场决策依据', cardX + 40, cardY + cardH - 80);

    ctx.font = '400 20px "Noto Sans SC", system-ui';
    ctx.fillStyle = '#6b7280';
    ctx.fillText('答题与计算均在本地浏览器完成 · 不收集个人信息', cardX + 40, cardY + cardH - 40);

    // 右下角：短链 / 二维码占位
    const qrSize = 180;
    const qrX = cardX + cardW - qrSize - 40;
    const qrY = cardY + cardH - qrSize - 60;
    ctx.strokeStyle = '#cbd5f5';
    ctx.lineWidth = 3;
    roundRect(ctx, qrX, qrY, qrSize, qrSize, 28, false, true);

    ctx.font = '400 20px "Noto Sans SC", system-ui';
    ctx.fillStyle = '#9ca3af';
    ctx.fillText('测试短链 /', qrX + 18, qrY + qrSize / 2 - 6);
    ctx.fillText('二维码占位', qrX + 18, qrY + qrSize / 2 + 24);

    // 导出
    shareCanvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `职场发疯人格_${persona.label}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      showToast('已生成并触发下载分享海报，可在相册/下载列表查看');
    }, 'image/png');
  }

  function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
    if (typeof radius === 'number') {
      radius = { tl: radius, tr: radius, br: radius, bl: radius };
    } else {
      radius = Object.assign({ tl: 0, tr: 0, br: 0, bl: 0 }, radius);
    }
    ctx.beginPath();
    ctx.moveTo(x + radius.tl, y);
    ctx.lineTo(x + width - radius.tr, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
    ctx.lineTo(x + width, y + height - radius.br);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
    ctx.lineTo(x + radius.bl, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
    ctx.lineTo(x, y + radius.tl);
    ctx.quadraticCurveTo(x, y, x + radius.tl, y);
    ctx.closePath();
    if (fill) ctx.fill();
    if (stroke) ctx.stroke();
  }

  function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = text.split('');
    let line = '';
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n];
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        ctx.fillText(line, x, y);
        line = words[n];
        y += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, y);
  }

  // 事件绑定
  if (startBtn) {
    startBtn.addEventListener('click', () => {
      const section = document.getElementById('testSection');
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const { scores, error } = computeScores();
      if (error) {
        const idx = parseInt(error.replace('q', ''), 10);
        showToast(`还有第 ${idx} 题未选择噢，可以顺着往下滑一滑。`);
        const card = document.querySelector(`[data-question="${error}"]`);
        if (card) {
          card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
      }

      const personaKey = pickPersona(scores);
      const persona = PERSONAS[personaKey];
      if (!persona) {
        showToast('生成结果时遇到一点小问题，请稍后再试');
        return;
      }

      resultTitle.textContent = `「${persona.label}」`;
      resultTagline.textContent = persona.tagline;
      resultDescription.textContent = persona.description;

      renderScoreBars(scores);
      renderDominantDimension(scores);

      resultSection.classList.remove('hidden');
      resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

      // 为分享按钮记录当前结果
      resultSection.dataset.personaKey = personaKey;
      resultSection.dataset.scores = JSON.stringify(scores);
    });
  }

  if (restartBtn) {
    restartBtn.addEventListener('click', () => {
      form.reset();
      resultSection.classList.add('hidden');
      const top = document.querySelector('header');
      if (top) top.scrollIntoView({ behavior: 'smooth' });
      showToast('已清空本次作答，可以重新按当下心情再测一次');
    });
  }

  if (savePosterBtn) {
    savePosterBtn.addEventListener('click', () => {
      const personaKey = resultSection.dataset.personaKey;
      const scores = resultSection.dataset.scores ? JSON.parse(resultSection.dataset.scores) : null;
      if (!personaKey || !scores) {
        showToast('请先完成测试并生成结果，再保存海报');
        return;
      }
      generatePoster(personaKey, scores);
    });
  }

  if (copyLinkBtn) {
    copyLinkBtn.addEventListener('click', async () => {
      const url = window.location.href.split('#')[0];
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(url);
          showToast('测试链接已复制，可以直接粘贴到聊天或朋友圈');
        } else {
          const textarea = document.createElement('textarea');
          textarea.value = url;
          textarea.style.position = 'fixed';
          textarea.style.opacity = '0';
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand('copy');
          textarea.remove();
          showToast('测试链接已复制，可以直接粘贴到聊天或朋友圈');
        }
      } catch (err) {
        console.error(err);
        showToast('复制失败，可以手动长按地址栏复制链接');
      }
    });
  }
});
