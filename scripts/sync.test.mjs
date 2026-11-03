import test from 'node:test';import assert from 'node:assert/strict';import{publicEdition}from'./sync.mjs';
const item={id:'x',kind:'文章',title:'标题',summary:'摘要',url:'https://example.com',reading:{takeaway:'要点',sections:[{heading:'依据',body:'内容'}],caveat:'局限'},privateNote:'secret'};
test('public projection excludes feedback and personalized adaptation',()=>{const e=publicEdition({date:'2026-11-02',intro:'开场',adaptation:'private preferences',feedback:['private'],token:'secret',items:Array.from({length:5},()=>item)});assert(!JSON.stringify(e).includes('secret'));assert(!JSON.stringify(e).includes('private'));assert.equal(e.items[0].reading.takeaway,'要点')});
test('rejects incomplete article and unsafe dates',()=>{assert.throws(()=>publicEdition({date:'../../bad',items:[]}));assert.throws(()=>publicEdition({date:'2026-11-02',items:Array.from({length:5},()=>({...item,reading:undefined}))}))});

import{feedbackNote}from'./feedback.mjs';
test('only owner feedback enters preferences, with bounded text and stable retry marker',()=>{const event={issue:{user:{login:'owner'},title:'[好奇日报反馈] 喜欢',body:'A'.repeat(4000),number:1,updated_at:'2026-11-03'}};const note=feedbackNote(event,'owner/repo');assert(note.note.length<=2000);assert.equal(note.marker,feedbackNote(event,'owner/repo').marker);assert.equal(feedbackNote(event,'different/repo'),null)});
