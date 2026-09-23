import { expect, test } from '@playwright/test';
for(const slug of ['galaxy-z-fold7','galaxy-z-flip8']) {
 test(`${slug} pinch preserves manual zoom and keyboard copies projected values`,async({page,context})=>{
  await context.grantPermissions(['clipboard-read','clipboard-write']);
  await page.goto('/'+slug);
  const width=page.locator('.projected-rulers [data-ruler="Display width"] [role="button"]');
  await expect(width).toBeVisible();
  const value=await width.locator('text').textContent();
  await page.evaluate(()=>navigator.clipboard.writeText(''));
  await width.focus(); await page.keyboard.press('Enter');
  await expect.poll(()=>page.evaluate(()=>navigator.clipboard.readText())).toBe(value);
  const scale=()=>page.locator('.diagram-position > div').evaluate(el=>{
   const m=new DOMMatrix(getComputedStyle(el).transform); return Math.hypot(m.a,m.b);
  });
  const before=await scale();
  const box=(await page.locator('#device-canvas').boundingBox())!;
  const cx=box.x+box.width/2,cy=box.y+10;
  const session=await context.newCDPSession(page);
  await session.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:cx-30,y:cy,id:1},{x:cx+30,y:cy,id:2}]});
  await session.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:cx-60,y:cy,id:1},{x:cx+60,y:cy,id:2}]});
  await session.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
  await expect.poll(scale).toBeCloseTo(before*2,2);
  const manual=await scale();
  await page.getByRole('button',{name:/^Pose:/}).click();
  await page.getByRole('button',{name:'Partially Folded',exact:true}).click();
  await expect(page.locator('[data-displayed-angle]')).toHaveAttribute('data-displayed-angle','90.00');
  expect(await scale()).toBeCloseTo(manual,3);
  await page.locator('#device-canvas').focus(); await page.keyboard.press('0');
  await expect.poll(scale).toBeLessThan(manual);
 });
}
