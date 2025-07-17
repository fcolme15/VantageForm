import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const CustomBarChart = (projections) => {
    const height = 300;
    const width = '100%';
    const title = 'Projections';
    const data = [
        { name: 'LightGBM', value: projections[0] },
        { name: 'ElasticNet', value: projections[1] },
        { name: 'Last 5 Avg', value: projections[2] }
    ]
    return (
        <div className="w-full max-w-4xl mx-auto p-4">
            {/* Title */}
            <h2 className="text-xl md:text-2xl font-bold text-center mb-6 text-gray-800">
                {title}
            </h2>

            {/* Chart Container */}
            <div className="bg-white rounded-lg shadow-lg p-4 md:p-6">
                <ResponsiveContainer width={width} height={height}>
                    <BarChart
                        data={data}
                        margin={{
                            top: 20,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                        <XAxis
                            dataKey="name"
                            tick={{ fontSize: 12 }}
                            interval={0}
                            angle={-45}
                            textAnchor="end"
                            height={60}
                        />
                        <YAxis
                            tick={{ fontSize: 12 }}
                            width={60}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#f8f9fa',
                                border: '1px solid #dee2e6',
                                borderRadius: '4px',
                                fontSize: '14px'
                            }}
                        />
                        <Bar
                            dataKey="value"
                            fill="#3b82f6"
                            radius={[4, 4, 0, 0]}
                            className="hover:opacity-80 transition-opacity"
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Mobile-friendly data summary */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2 md:hidden">
                {data.map((item, index) => (
                    <div key={index} className="bg-gray-100 rounded p-3 text-center">
                        <div className="text-sm font-semibold text-gray-600">{item.name}</div>
                        <div className="text-lg font-bold text-blue-600">{item.value}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};
export default CustomBarChart;

