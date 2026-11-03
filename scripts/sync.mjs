import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
export function publicEdition(value){
 if(!value||!/^\d{4}-\d{2}-\d{2}$/.test(value.date)||!Array.isArray(value.items)||value.items.length<5)throw Error('Invalid edition');
 const keys=['id','kind','title','summary','reason','source','url','published','tags','image','credit','classic','reading'];
 const items=value.items.map(i=>{if(!i.title||!i.summary||!/^https:\/\//.test(i.url)||(['文章','新闻'].includes(i.kind)&&!i.reading))throw Error('Incomplete article');return Object.fromEntries(keys.filter(k=>k in i).map(k=>[k,i[k]]))});
 // The editorial adaptation text can reveal personal preferences: replace it on public Pages.
 return {date:value.date,intro:value.intro,adaptation:'文章核心内容可直接在本站阅读，原文链接供查证。',items};
}
async function main(){
 const origin=new URL(process.env.SOURCE_SITE_URL||'https://daily-curiosity-zhrrygh.hugohu0423.chatgpt.site');
 if(origin.protocol!=='https:'||origin.hostname!=='daily-curiosity-zhrrygh.hugohu0423.chatgpt.site')throw Error('Unexpected source origin');
 const token=process.env.SOURCE_SITE_TOKEN;
 if(!token){if(process.env.REQUIRE_SYNC==='true')throw Error('SOURCE_SITE_TOKEN secret is missing');console.log('No sync credential; using committed snapshot.');return}
 async function get(path){const r=await fetch(new URL(path,origin),{headers:{'OAI-Sites-Authorization':'Bearer '+token},redirect:'error',signal:AbortSignal.timeout(30000)});if(!r.ok)throw Error('Source request failed: '+r.status);return r.json()}
 const feed=await get('/api/feed');if(!feed.edition)throw Error('No source edition');
 const dates=feed.dates.filter(d=>/^\d{4}-\d{2}-\d{2}$/.test(d)).slice(0,90);
 const outputs=[];
 for(const date of dates){const raw=date===feed.edition.date?feed.edition:(await get('/api/feed?date='+date)).edition;const e=publicEdition(raw);if(e.date!==date)throw Error('Date mismatch');outputs.push(e)}
 // Validate every edition before replacing local data; never write raw responses with feedback.
 await mkdir('public/data',{recursive:true});for(const e of outputs)await writeFile('public/data/'+e.date+'.json',JSON.stringify(e,null,2));
 await writeFile('public/data/index.json',JSON.stringify({dates:outputs.map(e=>e.date).sort().reverse()},null,2));console.log('Synced '+outputs.length+' editions.');
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)await main();
