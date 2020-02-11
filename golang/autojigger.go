package autojigger

import (
	"io/ioutil"
	"strings"
)

const (
	srcPath     = "../src/"
	srcFileCSS  = srcPath + "css/autojigger.min.css"
	srcFileJS   = srcPath + "js/autojigger.min.js"
	srcFileHTML = srcPath + "html/autojigger.html"
)

// Manager AutoJigger definition
type Manager struct {
	css      string
	js       string
	html     string
	content  string
	title    string
	sitename string
}

// AJMgr AutoJigger Manager global object
var AJMgr *Manager

func init() {
	AJMgr = &Manager{
		content: "<h1>Hello World!</h1>",
		title:   "Go Auto-Jigger",
	}

	err := AJMgr.loadAll()
	if err != nil {
		panic(err)
	}
}

func (m *Manager) loadFile(fn string) (content string, err error) {
	var bytes []byte

	bytes, err = ioutil.ReadFile(fn)
	if err != nil {
		return "", err
	}
	return string(bytes), nil
}

func (m *Manager) loadAll() error {
	var (
		err error
	)

	m.html, err = m.loadFile(srcFileHTML)
	if err != nil {
		return err
	}

	m.html, err = m.loadFile(srcFileCSS)
	if err != nil {
		return err
	}

	m.html, err = m.loadFile(srcFileJS)
	if err != nil {
		return err
	}

	m.populate()
	return nil
}

func (m *Manager) populate() {
	m.html = strings.Replace(m.html, "{$AJCSS$}", m.css, -1)
	m.html = strings.Replace(m.html, "{$AJJS$}", m.js, -1)
	m.html = strings.Replace(m.html, "{$TITLE$}", m.title, -1)
	m.html = strings.Replace(m.html, "{$SITENAME$}", m.sitename, -1)
	m.html = strings.Replace(m.html, "{$AJCONTENT$}", m.content, -1)
}

// SetContent allows setting the actual page (initial) content
func (m *Manager) SetContent(s string) {
	m.content = s
	m.populate()
}

// SetTitle sets what is diplayed in <TITLE>
func (m *Manager) SetTitle(s string) {
	m.title = s
	m.populate()
}

// SetSiteName sets what is displayed in META as well as the Loading Animation
func (m *Manager) SetSiteName(s string) {
	m.sitename = s
	m.populate()
}

// Set allows setting all three values at the same time
func (m *Manager) Set(title, sitename, content string) {
	m.title = title
	m.sitename = sitename
	m.content = content
	m.populate()
}

// RenderAsString returns the complete AutoJigger HTML5 document as a string
func (m *Manager) RenderAsString() string {
	return m.html
}

// RenderAsBytes returns the complete AutoJigger HTML5 document as a byte array
func (m *Manager) RenderAsBytes() []byte {
	return []byte(m.html)
}
