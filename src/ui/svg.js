import { Component } from 'react';
import { h } from 'react-hyperscript-helpers';
import renderHTML from 'react-render-html';

const svgCache = {};

export default class InjectSVG extends Component {
  /* eslint-disable react/no-unused-prop-types */

  static defaultProps = {
    svgFolder: 'svg/optimized',
    path: '',
    containerClassName: undefined,
    containerOnClick: undefined,
  };

  state = {
    svgElement: undefined,
  };

  constructor() {
    super();
    this.svgCache = svgCache;
  }

  componentWillMount() {
    this.loadSvg();
  }

  componentWillReceiveProps(nextProps) {
    const nextUrl = this.getUrl(nextProps);
    const prevUrl = this.getUrl();

    if (nextUrl === prevUrl) return;

    this.loadSvg(nextProps);
  }

  getUrl(props = this.props) {
    const { path, svgFolder } = props;
    const url = `${svgFolder}/${path}`;

    /* global chrome */
    const canUseChromeGetURL =
      typeof chrome !== 'undefined' &&
      chrome.runtime &&
      typeof chrome.runtime.getURL === 'function';
    if (canUseChromeGetURL) {
      return chrome.runtime.getURL(url);
    }

    return url;
  }

  loadSvg(props = this.props) {
    try {
      const url = this.getUrl(props);

      if (this.svgCache[url]) {
        this.setState({
          svgElement: this.svgCache[url],
        });
        return;
      }

      const httpRequest = this.makeHttpRequest();

      httpRequest.onload = () => {
        const READY_STATE_COMPLETE = 4;
        const STATUS_OK = 200;
        const STATUS_OK_LOCAL = 0;

        if (httpRequest.readyState === READY_STATE_COMPLETE) {
          if (
            httpRequest.status === STATUS_OK ||
            httpRequest.status === STATUS_OK_LOCAL
          ) {
            if (httpRequest.responseXML) {
              this.svgCache[url] = renderHTML(
                new XMLSerializer().serializeToString(
                  httpRequest.responseXML.documentElement,
                ),
              );

              if (!this.svgEl) return;
              this.setState({
                svgElement: this.svgCache[url],
              });
            } else {
              handleError('SVG response did not contain document.');
            }
          } else {
            handleError('SVG response status was not OK.');
          }
        }
      };

      httpRequest.onerror = handleError;

      httpRequest.open('GET', url);
      httpRequest.send();
    } catch (error) {
      handleError(error);
    }

    function handleError(error) {
      console.warn(error);
    }
  }

  /* eslint-disable class-methods-use-this */
  makeHttpRequest() {
    return new XMLHttpRequest();
  }

  render() {
    const { containerClassName, containerOnClick } = this.props;
    const divProps = { ...this.props };
    const markup = this.state.svgElement;

    Object.keys(this.constructor.defaultProps).forEach((propName) => {
      delete divProps[propName];
    });

    return h(
      'div',
      {
        ref: (el) => {
          this.svgEl = el;
        },
        className: containerClassName,
        onClick: containerOnClick,
        ...divProps,
      },
      [markup],
    );
  }
}
