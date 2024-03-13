import * as cheerio from 'cheerio';
import fs from 'fs';
import { data } from './Data/data'

function Main() {
  //   const fileContent = `<div tabindex="0" role="button">
  //   <img alt="" src="https://theunitedstates.io/images/congress/original/B001224.jpg">
  //   <div>
  //       <div>
  //           <h3>Rep. Cori Bush</h3>
  //           <p><span>Democrat</span> • MO-01</p><span>Supports Ceasefire</span>
  //       </div>
  //       <div><span>A</span>
  //       </div>
  //   </div>
  // </div>`

  const $ = cheerio.load(data);

  $('div[tabindex="0"]').each((i, element) => {
    const result = Parse($(element)); // Pass the Cheerio object
    console.log(result);
  });
}

function Parse(child: cheerio.Cheerio<any>): Record<string, any> {
  const newLegislature: Record<string, any> = {};

  const imgElement = child.find('img'); // Use .find() instead of .querySelector()
  if (imgElement.length) {
    newLegislature.ImageURL = imgElement.attr('src');
  }

  newLegislature.Name = child.find('h3').text() || '';
  newLegislature.Party = child.find('span').eq(0).text() || '';
  // console.log(child.find('p'));
  newLegislature.Status = child.find('p').eq(0).next().text() || '';
  newLegislature.Grading = child.find('div').eq(2).find('span').text().trim() || '';

  var district = child.find('p').text().trim() || '';
  var array = district.split('•');
  var buffer = array[1].substring(1, 6);
  newLegislature.District = buffer;

  if (newLegislature.Name.startsWith('Rep.')) {
    newLegislature.Role = 'Representative';
  } else if (newLegislature.Name.startsWith('Sen.')) {
    newLegislature.Role = 'Senator';
  }

  return newLegislature;
}

Main();
