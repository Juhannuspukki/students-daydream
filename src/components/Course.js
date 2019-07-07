import React from 'react';
import './Course.scss';
import _ from 'underscore';
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { Container, Row, Col } from 'reactstrap';
import kaiku from '../kaiku.json';
import CustomizedXAxisTick from './CustomTick';
import NavBar from './NavBar';

const processData = (props) => {
  const course = _.findWhere(kaiku, { id: props.match.params.id });
  const { name } = course;
  const chartData = [];
  const samples = [];
  const codes = [];
  const letters = [];

  _.map(_.findWhere(kaiku, course).instances, (instance) => {
    chartData.push(
      { year: instance.year, grade: instance.grade, work: instance.work },
    );
    if (codes.indexOf(instance.code) === -1) {
      codes.push(instance.code);
    }
    samples.push({ year: instance.year, sampleSize: instance.sampleSize });
    if (instance.letter) {
      letters.push(instance.letter);
    }
  });

  codes.reverse();

  return ({
    name,
    chartData,
    samples,
    codes,
    letters,
  });
};

const Course = (props) => {
  const {
    name,
    chartData,
    codes,
    samples,
    letters,
  } = processData(props);

  return (
    <Container>
      <NavBar pretitle="The incredible" title={'Course\u2011O\u2011Meter'} />
      <h2 className="Course-Name">{name}</h2>
      <h3 className="Course-Codes">
        {codes[0]}
        {(codes.length > 1) && (', previously known as ')}
        {(codes.length > 1) && (codes.slice(1).join(', '))}
      </h3>
      <h3 className="Course-Grades">{letters.join(', ')}
      </h3>
      <Row>
        <Col md={6} className="Chart">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData} syncId="charts">
              <CartesianGrid strokeDasharray="10 10" />
              <XAxis dataKey="year" height={50} tick={<CustomizedXAxisTick />} />
              <YAxis dataKey="grade" yAxisId="left" domain={[2.5, 4.5]} />
              <YAxis dataKey="work" yAxisId="right" orientation="right" domain={[-50, 50]} />
              <Tooltip />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="grade" stroke="#355f8c" name="Grade" style={{ color: '#fff' }} />
              <Line yAxisId="right" type="monotone" dataKey="work" stroke="#5f8c35" name="Work" />
            </LineChart>
          </ResponsiveContainer>
        </Col>
        <Col md={6} className="Chart">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={samples}
              margin={{
                top: 0, right: 60, left: 0, bottom: 0,
              }}
              syncId="charts"
            >
              <CartesianGrid strokeDasharray="10 10" />
              <XAxis dataKey="year" height={50} tick={<CustomizedXAxisTick />} />
              <YAxis dataKey="sampleSize" yAxisId="left" />
              <Tooltip />
              <Legend />
              <ReferenceLine yAxisId="left" y={21} stroke="red" />
              <Line yAxisId="left" type="monotone" dataKey="sampleSize" stroke="#8c355f" name="Sample Size" style={{ color: '#fff' }} />
            </LineChart>
          </ResponsiveContainer>
        </Col>
      </Row>
    </Container>
  );
};


export default Course;
