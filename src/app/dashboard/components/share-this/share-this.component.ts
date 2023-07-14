import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-share-this',
  template: `
    <div
      class="sharethis-inline-follow-buttons st-inline-follow-buttons st-#{action_pos}  st-animated"
      id="st-1"
    >
      <div class="st-left">
        <span>Follow me:</span>
      </div>
      <div
        class="st-btn st-first"
        data-network="linkedin"
        style="display: inline-block;"
      >
        <a href="https://www.linkedin.com/in/michaelpetty-stl/">
          <img
            alt="linkedin sharing button"
            src="https://platform-cdn.sharethis.com/img/linkedin.svg"
            style="width: 25px; height: 25px;"
          />
        </a>
      </div>
      <div
        class="st-btn st-last"
        data-network="github"
        style="display: inline-block;"
      >
        <a href="https://github.com/michaelp1985">
          <img
            alt="github sharing button"
            src="https://platform-cdn.sharethis.com/img/github.svg"
            style="width: 25px; height: 25px;"
          />
        </a>
      </div>
    </div>
  `,
})
export class ShareThisComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
