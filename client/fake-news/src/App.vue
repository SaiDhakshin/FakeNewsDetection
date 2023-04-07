<template>
  <header>
    <div class="header">
      <h1>Fake News Detection</h1>
    </div>
  </header>

  <section>
    <h2 class="content">Wanna Know if the News You have is Fake?</h2>

    <p class="content">
      Welcome to our fake news detection website, where we strive to provide
      accurate and reliable information to our users. Our mission is to help
      people distinguish between real news and fake news, and to promote
      responsible and informed journalism.
    </p>

    <p class="content">
      We understand that the spread of fake news can have serious consequences,
      and can undermine trust in the media and democratic institutions. That's
      why we use the latest technology and research to identify and analyze
      potentially misleading or false information.
    </p>

    <p class="content">
      Our team of expert fact-checkers carefully examine news stories and
      claims, using multiple sources and methods to verify their accuracy. We
      also provide helpful tips and resources for readers to help them spot fake
      news on their own.
    </p>

    <p class="content">
      We believe that everyone has a role to play in combating fake news, and we
      are committed to promoting media literacy and critical thinking skills. By
      working together, we can build a more informed and trustworthy media
      environment.
    </p>

    <p class="content">
      Thank you for visiting our website, and we hope you find our resources
      helpful in navigating the complex and ever-changing landscape of modern
      news.
    </p>

    <div class="content">
      <div>
        <select name="" id="" v-model="provider">
          <option default value="">Choose your provider</option>
          <option value="google-in">Google INDIA</option>
          <option value="gnews">GNews</option>
        </select>
      </div>
      <div v-if="provider == 'google-in'">
        <select name="" id="" v-model="sources">
          <option default value="">Choose your source</option>
          <option value="bbc-news">BBC</option>
          <option value="google-news-in">Google News India</option>
          <option value="cnn">CNN</option>
        </select>
      </div>
      <div>
        <input class="search_bar" type="text" v-model="query" />
      </div>
      <div class="buttons">
        <button @click.prevent="onVerify">Verify</button
        ><button @click.prevent="onClear">Clear</button>
      </div>
    </div>
  </section>

  <section>
    <div class="content" v-if="hide == false">
      <h2>
        Results : <span v-if="match > 0" class="success">Not Fake</span>
        <span v-if="match <= 0" class="warning">Fake</span>
        <span class="" v-if="match == 0 && notmatch == 0"
          >Did not Match any Results</span
        >
      </h2>
      <div>
        <p>
          Number of matches: {{ match }} | Number of non-matches: {{ notmatch }}
        </p>
      </div>
      <div v-for="article in articles" :key="article">
        <div v-if="article.fake == true">
          <div class="card">
            <h2>{{ article.title }}</h2>
            <p>{{ article.author }}</p>
            <p class="warning">The News does not match</p>
          </div>
        </div>
        <div v-else>
          <div class="card">
            <h2>{{ article.title }}</h2>
            <p>{{ article.author }}</p>
            <p class="success">The News matches</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <footer class="footer">
    <p>© 2023 Fake News Detection. All rights reserved.</p>
    <ul>
      <li><a href="#">Terms of Use</a></li>
      <li><a href="#">Privacy Policy</a></li>
      <li><a href="#">Contact Us</a></li>
    </ul>
  </footer>

  <!-- <section>
    <label for="">Headlines</label>
    <input type="text" v-model="query2" />
    <button @click.prevent="onVerify2">Verify</button
    ><button @click.prevent="onClear2">Clear</button>
  </section>

  <section>
    <div>
      <p v-for="article in articles2" :key="article">{{ article }}</p>
    </div>
  </section> -->
</template>

<script>
import axios from "axios";

export default {
  name: "App",
  data() {
    return {
      provider: "",
      query: "",
      query2: "",
      fake: "",
      fake1: [],
      fake2: "",
      articles: [],
      articles2: [],
      hide: true,
      match: 0,
      notmatch: 0,
      sources: "",
    };
  },
  methods: {
    async onVerify() {
      console.log(this.provider);
      this.match = 0;
      this.notmatch = 0;
      this.hide = false;
      this.articles = [];

      if (this.provider == "google-in") {
        try {
          await axios
            .post("http://localhost:3000/verify", {
              data: this.query,
              source: this.sources,
            })
            .then((response) => {
              console.log(response);
              for (let article of response.data.articles) {
                console.log(JSON.stringify(article));
                console.log(article.title.includes(this.query));
                let title = article.title.toLowerCase();
                let querySearch = this.query.toLowerCase();
                if (title.includes(querySearch)) {
                  this.fake1.push("False");
                  this.fake = false;
                  this.match++;
                } else {
                  this.fake1.push("True");
                  this.fake = true;
                  this.notmatch++;
                }
                this.articles.push({
                  title: JSON.stringify(article.title),
                  author: JSON.stringify(article.author),
                  fake: this.fake,
                });
              }
            })
            .catch((err) => {
              console.log(err);
            });
        } catch (err) {
          console.log(err);
        }
      }

      if (this.provider == "gnews") {
        axios
          .post("http://localhost:3000/gnews", { data: this.query })
          .then((response) => {
            console.log(response);

            for (let article of response.data.articles) {
              console.log(JSON.stringify(article));
              console.log(article.title.includes(this.query));
              let title = article.title.toLowerCase();
              let querySearch = this.query.toLowerCase();
              if (title.includes(querySearch)) {
                this.fake1.push("False");
                this.fake = false;
                this.match++;
              } else {
                this.fake1.push("True");
                this.fake = true;
                this.notmatch++;
              }
              this.articles.push({
                title: JSON.stringify(article.title),
                fake: this.fake,
              });
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },
    onClear() {
      this.articles = [];
      this.query = "";
      this.hide = true;
      this.match = 0;
      this.notmatch = 0;
    },
  },
};
</script>

<style></style>
