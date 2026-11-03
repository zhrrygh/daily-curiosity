import {readFile} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
export function feedbackNote(event,repository){
 const issue=event.issue;if(!issue||issue.user?.login?.toLowerCase()!==repository.split('/')[0].toLowerCase()||!issue.title.startsWith('[好奇日报反馈]'))return null;
 const marker='GitHub feedback '+repository+'#'+issue.number+' @ '+issue.updated_at;
 return {marker,note:(marker+'\n'+issue.title+'\n'+(issue.body||'')).slice(0,2000)};
}
async function main(){
 const event=JSON.parse(await readFile(process.env.GITHUB_EVENT_PATH,'utf8'));const data=feedbackNote(event,process.env.GITHUB_REPOSITORY||'');if(!data){console.log('Not an owner preference issue; skipped.');return}
 const token=process.env.SOURCE_SITE_TOKEN;if(!token)throw Error('SOURCE_SITE_TOKEN is required to synchronize feedback');
 const origin='https://daily-curiosity-zhrrygh.hugohu0423.chatgpt.site';
 async function request(path,body){const r=await fetch(origin+path,{method:body?'POST':'GET',headers:{'OAI-Sites-Authorization':'Bearer '+token,'Content-Type':'application/json'},body:body?JSON.stringify(body):undefined,redirect:'error',signal:AbortSignal.timeout(30000)});if(!r.ok)throw Error('Feedback sync HTTP '+r.status);return r.json()}
 const before=await request('/api/editor');if(before.feedback.some(f=>f.note?.startsWith(data.marker+'\n'))){console.log('Feedback already synchronized.');return}
 await request('/api/feedback',{itemId:'github-issue-'+event.issue.number,value:'note',note:data.note});
 const after=await request('/api/editor');if(!after.feedback.some(f=>f.note?.startsWith(data.marker+'\n')))throw Error('Feedback readback failed');console.log('Owner feedback synchronized.');
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)await main();
