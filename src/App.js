import React, { PureComponent } from 'react';
import * as BABYLON from 'babylonjs';
import { Swipe } from "react-swipe-component";
import Cards from './assets/cards.json';
import moment from 'moment-timezone';

import Scene from './components/Scene';
import './App.css';
import './layout.css';
import { Score } from './components/Score';

const EARTH_DIAMETER = 12.742;
const DISTANCE_SUN_EARTH = 149.600000;
const INITIAL_CAMERA_DISTANCE = 25.000;

const THEMES = ['Industrial', 'Agricultura', 'Saude', 'Educacao', 'Ecologia'];

export class App extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      date: moment('2000-01-01'),
      media: 50,
      founds: 2000,
      cards: [],
      currentCard: {},
      industry: {
        icon: 'icons/factory.svg',
        amount: 0,
        progress: 50,
      },
      agriculture: {
        icon: 'icons/agriculture.svg',
        amount: 0,
        progress: 50,
      },
      health: {
        icon: 'icons/first-aid-kit.svg',
        amount: 0,
        progress: 50,
      },
      education: {
        icon: 'icons/graduation.svg',
        amount: 0,
        progress: 50,
      },
      nature: {
        icon: 'icons/trees.svg',
        amount: 0,
        progress: 50,
      },
    }
  }

  componentDidMount() {
    const currentCard = this.getRandomCard(Cards);
    const newCards = [...Cards]
    newCards.filter(card => card.Id !== currentCard.Id);
    this.setState({ cards: newCards, currentCard });
  }

  getRandomCard = (cards) => {
    const randomTheme = THEMES[parseInt(Math.random() * 100 % THEMES.length - 1)];
    const cardsFromTheme = [...cards].filter(card => card.Tema === randomTheme);
    const randomCard = cardsFromTheme[parseInt(Math.random() * 100 % cardsFromTheme.length - 1)];
    return randomCard;
  }

  onSceneMount = (e) => {
    const { engine, scene, canvas } = e;

    scene.clearColor = new BABYLON.Color3(.5, .5, .5);

    // camera
    var camera = new BABYLON.ArcRotateCamera("camera1", -Math.PI / 2, Math.PI / 4, INITIAL_CAMERA_DISTANCE, new BABYLON.Vector3(0, 0, 0), scene);
    camera.attachControl(canvas, true);
    camera.lowerRadiusLimit = EARTH_DIAMETER;
    camera.upperRadiusLimit = DISTANCE_SUN_EARTH;


    // lights
    new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 0, DISTANCE_SUN_EARTH * -1), scene);

    var earth = BABYLON.MeshBuilder.CreateSphere("earth", { diameter: EARTH_DIAMETER }, scene);
    var earthMaterial = new BABYLON.StandardMaterial("ground", scene);
    earthMaterial.diffuseTexture = new BABYLON.Texture("/earth.jpg", scene);
    earthMaterial.diffuseTexture.vScale = -1;
    earth.material = earthMaterial;
    var earthAxis = new BABYLON.Vector3(Math.sin(23 * Math.PI / 180), Math.cos(23 * Math.PI / 180), 0);

    var sky = BABYLON.MeshBuilder.CreateSphere("sky", { diameter: DISTANCE_SUN_EARTH * 2 }, scene);
    var skyMaterial = new BABYLON.StandardMaterial("ground", scene);
    skyMaterial.diffuseTexture = new BABYLON.Texture("/milky.jpg", scene);
    skyMaterial.diffuseTexture.vScale = -1;
    skyMaterial.backFaceCulling = false;
    sky.material = skyMaterial;

    var angle = 0.01;
    scene.registerBeforeRender(function () {
      earth.rotate(earthAxis, angle, BABYLON.Space.WORLD);
    })

    engine.runRenderLoop(() => {
      if (scene) {
        scene.render();
      }
    });

    return scene;
  }

  render() {
    const {
      industry, agriculture, health,
      education, nature, founds,
      currentCard, media, date,
    } = this.state;
    return (
      <>
        <div className="container">
          <div id='dinheiro'>U$ {founds.toFixed(2)}</div>
          <div className="col-tela centro">
            <div className="header">
              <div id="data">{date.format('MMMM DD[,] YYYY')}</div>
            </div>
            <Swipe
              nodeName="div"
              className="test"
              onSwipedLeft={() => {
                const { currentCard, founds } = this.state;
                const newCard = this.getRandomCard(this.state.cards);
                const newCards = [...this.state.cards];
                newCards.filter(card => card.Id !== newCard.Id);
                const { agriculture, health, industry, nature, education } = this.state;

                const newAgriculture = { ...agriculture }
                const newHealth = { ...health }
                const newIndustry = { ...industry }
                const newNature = { ...nature }
                const newEducation = { ...education }

                newIndustry.progress += currentCard.Esquerda.Industria * 0.4;
                newAgriculture.progress += currentCard.Esquerda.Agricultura * 0.4;
                newHealth.progress += currentCard.Esquerda.Saude * 0.4;
                newEducation.progress += currentCard.Esquerda.Educacao * 0.4;
                newNature.progress += currentCard.Esquerda.Ecologia * 0.4;

                const newFounds = founds + (founds * currentCard.Esquerda.Dinheiro);

                const media = (newIndustry.progress + newAgriculture.progress + newHealth.progress + newEducation.progress + newNature.progress) / 5;
                this.setState({
                  currentCard: newCard,
                  cards: newCards,
                  industry: newIndustry,
                  agriculture: newAgriculture,
                  health: newHealth,
                  education: newEducation,
                  nature: newNature,
                  media,
                  founds: newFounds,
                });
              }}
              onSwipedRight={() => {
                const { currentCard, founds } = this.state;
                const newCard = this.getRandomCard(this.state.cards);
                const newCards = [...this.state.cards];
                newCards.filter(card => card.Id !== newCard.Id);
                const { agriculture, health, industry, nature, education } = this.state;

                const newAgriculture = { ...agriculture }
                const newHealth = { ...health }
                const newIndustry = { ...industry }
                const newNature = { ...nature }
                const newEducation = { ...education }

                newIndustry.progress += currentCard.Direita.Industria * 0.4;
                newAgriculture.progress += currentCard.Direita.Agricultura * 0.4;
                newHealth.progress += currentCard.Direita.Saude * 0.4;
                newEducation.progress += currentCard.Direita.Educacao * 0.4;
                newNature.progress += currentCard.Direita.Ecologia * 0.4;

                const newFounds = founds + (founds * currentCard.Direita.Dinheiro);

                const media = (newIndustry.progress + newAgriculture.progress + newHealth.progress + newEducation.progress + newNature.progress) / 5;
                this.setState({
                  currentCard: newCard,
                  cards: newCards,
                  industry: newIndustry,
                  agriculture: newAgriculture,
                  health: newHealth,
                  education: newEducation,
                  nature: newNature,
                  media,
                  founds: newFounds,
                });
              }}
            >
              <div className="carta" draggable
                styles={{
                  position: 'absolute',
                  transformX: ``
                }}
              >
                <h1>
                  {currentCard.Texto}
                </h1>
                <div className="bottom-carta">
                  <div className="space-bottom">
                    <span id='onus'>- U$150,00/s</span>
                    <span id='bonus'>+10% sit amet consectetur</span>
                  </div>
                </div>
        {/* <img id="pen" src="icons/pen.png" alt="" /> */}
              </div>
            </Swipe>
          </div>
          <div className="scoreboardContainer">
            <div className="scoreboard">
              <div className="scores">
                <Score {...industry} />
                <Score {...agriculture} />
                <Score {...health} />
                <Score {...education} />
                <Score {...nature} />
              </div>
            </div>
          </div>
        </div>
        {/* <img id="clip1" src="icons/clip.png" alt="" />
        <img id="clip2" src="icons/clip.png" alt="" /> */}
        <div className="health">
          <img src="icons/donation.svg" alt="" />
          <div id="health-bar">
            <span id="bar-fill" style={{ height: `${media}%` }}></span>
          </div>
        </div>
        <div className="world">
          <Scene onSceneMount={this.onSceneMount} width="200" height="280" />
        </div>
      </>
    );
  };

}

export default App;
